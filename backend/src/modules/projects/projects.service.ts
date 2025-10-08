import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { supabaseAdmin } from 'src/config/database.config';

interface ListFilter {
  status?: string;
  search?: string;
}

@Injectable()
export class ProjectsService {
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

  async detail(id: string) {
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    if (!project) throw new NotFoundException('Project not found');

    const [membersRes, updatesRes] = await Promise.all([
      // Lấy danh sách thành viên + role theo view profile_with_projects
      supabaseAdmin
        .from('profile_with_projects')
        .select('id,name,phone,avatar_url,email,department_name,project_role,project_id')
        .eq('project_id', id),
      supabaseAdmin
        .from('project_updates')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false }),
    ]);

    if (membersRes.error) throw new InternalServerErrorException(membersRes.error.message);
    if (updatesRes.error) throw new InternalServerErrorException(updatesRes.error.message);

    return { project, members: membersRes.data, updates: updatesRes.data };
  }

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

  async update(id: string, payload: { name?: string; description?: string; status?: string; start_date?: string; end_date?: string }) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        name: payload.name,
        description: payload.description,
        status: payload.status,
        start_date: payload.start_date ? new Date(payload.start_date) : undefined,
        end_date: payload.end_date ? new Date(payload.end_date) : undefined,
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    if (!data) throw new NotFoundException('Project not found');
    return data;
  }

  async remove(id: string) {
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    if (error) throw new InternalServerErrorException(error.message);
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


