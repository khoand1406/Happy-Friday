import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { supabaseAdmin } from 'src/config/database.config';

interface ListFilter {
  status?: string;
  search?: string;
}

@Injectable()
export class ProjectsService {
  // get list projects
  async list(page = 1, perPage = 10, filter: ListFilter = {}) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabaseAdmin.from('projects').select('*');
    if (filter.status) query = query.eq('status', filter.status);
    if (filter.search) query = query.ilike('name', `%${filter.search}%`);

    const { data, error } = await query.range(from, to);
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  // get project detail
  async detail(id: string) {
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    if (!project) throw new NotFoundException('Project not found');

    const [membersRes, updatesRes] = await Promise.all([
      // Lấy danh sách thành viên + role từ project_members join với users và department
      supabaseAdmin
        .from('project_members')
        .select(`
          project_role,
          project_id,
          users!inner(
            id,
            name,
            phone,
            avatar_url,
            department_id,
            department!inner(
              name
            )
          )
        `)
        .eq('project_id', id),
      supabaseAdmin
        .from('project_updates')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false }),
    ]);

    if (membersRes.error) throw new InternalServerErrorException(membersRes.error.message);
    if (updatesRes.error) throw new InternalServerErrorException(updatesRes.error.message);

    // Format members data để match với frontend
    const formattedMembers = membersRes.data?.map((member: any) => ({
      id: member.users.id,
      name: member.users.name,
      phone: member.users.phone,
      avatar_url: member.users.avatar_url,
      email: null, // Không có email từ users table, cần lấy từ auth.users
      department_name: member.users.department.name,
      project_role: member.project_role,
      project_id: member.project_id
    })) || [];

    return { project, members: formattedMembers, updates: updatesRes.data };
  }

  // create projects 
  async create(payload: { name: string; description: string; status: string; start_date?: string; end_date?: string }) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        name: payload.name,
        description: payload.description,
        status: payload.status,
        start_date: payload.start_date ? new Date(payload.start_date) : null,
        end_date: payload.end_date ? new Date(payload.end_date) : null
      } as any)
      .select('*')
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  // update projects 
  async update(id: string, payload: { name?: string; description?: string; status?: string; start_date?: string; end_date?: string }) {
    console.log('[ProjectsService] Update called with:', { id, payload });
    
    // Filter out undefined values to avoid Supabase errors
    const updateData: any = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.status !== undefined) updateData.status = payload.status;
    if (payload.start_date !== undefined) updateData.start_date = payload.start_date ? new Date(payload.start_date) : null;
    if (payload.end_date !== undefined) updateData.end_date = payload.end_date ? new Date(payload.end_date) : null;

    console.log('[ProjectsService] Update data:', updateData);

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    
    console.log('[ProjectsService] Supabase response:', { data, error });
    
    if (error) {
      console.error('[ProjectsService] Supabase error:', error);
      throw new InternalServerErrorException(error.message);
    }
    if (!data) throw new NotFoundException('Project not found');
    return data;
  }

  async remove(id: string) {
    console.log('[ProjectsService] Delete called with id:', id);
    
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    
    console.log('[ProjectsService] Delete response:', { error });
    
    if (error) {
      console.error('[ProjectsService] Delete error:', error);
      throw new InternalServerErrorException(error.message);
    }
    return { message: 'Project deleted' };
  }

  // --- FEED / UPDATES ---
  async listUpdates(projectId: string) {
    const { data, error } = await supabaseAdmin
      .from('project_updates')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async createUpdate(projectId: string, authorId: string, payload: { title: string; content: string }) {
    // Chỉ cho phép nếu user là thành viên của project
    const { data: member, error: memberErr } = await supabaseAdmin
      .from('project_members')
      .select('id, user_id, project_id, project_role')
      .eq('project_id', projectId)
      .eq('user_id', authorId)
      .single();
    if (memberErr || !member) {
      throw new NotFoundException('You are not a member of this project');
    }

    const { data, error } = await supabaseAdmin
      .from('project_updates')
      .insert({
        project_id: Number(projectId),
        title: payload.title,
        content: payload.content,
      } as any)
      .select('*')
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  // --- STATUS UPDATE (PM/Owner) ---
  async updateStatus(projectId: string, userId: string, status: string) {
    // Kiểm tra vai trò: Project Manager/Owner mới được đổi status
    const { data: member, error: memberErr } = await supabaseAdmin
      .from('project_members')
      .select('project_role')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .single();
    if (memberErr || !member) {
      throw new NotFoundException('You are not a member of this project');
    }
    const role = String((member as any).project_role || '').toLowerCase();
    const canUpdate = role === 'project manager' || role === 'owner' || role === 'pm';
    if (!canUpdate) {
      throw new NotFoundException('Insufficient permission to update project status');
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({ status })
      .eq('id', projectId)
      .select('*')
      .single();
    if (error) throw new InternalServerErrorException(error.message);

    return data;
  }
}


