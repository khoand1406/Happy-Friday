import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { supabaseAdmin } from 'src/config/database.config';
import { sendMail } from 'src/common/mailer';

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

  // Build query with select (request exact count) then apply filters
  let query: any = supabaseAdmin.from('projects').select('*', { count: 'exact' });
  if (filter.status) query = query.eq('status', filter.status);
  if (filter.search) {
    // Tìm kiếm trong cả name và description
    query = query.or(`name.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
  }

  // Use count: 'exact' to get total rows and paginate
  const { data, count, error } = await query.range(from, to);
    if (error) throw new InternalServerErrorException(error.message);

    return { items: data || [], total: typeof count === 'number' ? count : (data || []).length };
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

    // 1) Lấy danh sách member thô từ bảng project_members
    const { data: rawMembers, error: membersError } = await supabaseAdmin
      .from('project_members')
      .select('user_id, project_id, project_role')
      .eq('project_id', id);
    if (membersError) throw new InternalServerErrorException(membersError.message);

    // 2) Truy vấn thông tin user từ bảng public.users
    const memberIds = (rawMembers || []).map((m: any) => m.user_id);
    const { data: profiles, error: profilesError } = memberIds.length
      ? await supabaseAdmin
          .from('users')
          .select('id, name, phone, avatar_url, department_id')
          .in('id', memberIds)
      : { data: [], error: null } as any;
    if (profilesError) throw new InternalServerErrorException(profilesError.message);

    // 3) Truy vấn thông tin phòng ban
    const departmentIds = [...new Set((profiles || []).map((p: any) => p.department_id).filter(Boolean))];
    const { data: departments, error: departmentsError } = departmentIds.length
      ? await supabaseAdmin
          .from('department')
          .select('id, name')
          .in('id', departmentIds)
      : { data: [], error: null } as any;
    if (departmentsError) throw new InternalServerErrorException(departmentsError.message);

    // 4) Lấy updates song song
    const { data: updatesData, error: updatesError } = await supabaseAdmin
      .from('project_updates')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });
    if (updatesError) throw new InternalServerErrorException(updatesError.message);

    // Format members data để match với frontend
    const idToProfile = new Map<string, any>();
    (profiles || []).forEach((p: any) => idToProfile.set(p.id, p));

    const idToDepartment = new Map<number, any>();
    (departments || []).forEach((d: any) => idToDepartment.set(d.id, d));

    const formattedMembers = (rawMembers || []).map((m: any) => {
      const p = idToProfile.get(m.user_id) || {};
      const department = p.department_id ? idToDepartment.get(p.department_id) : null;
      return {
        id: p.id || m.user_id,
        name: p.name || null,
        phone: p.phone || null,
        avatar_url: p.avatar_url || null,
        email: null, // Không có email trong public.users
        department_name: department?.name || null,
        project_role: m.project_role,
        project_id: m.project_id,
      };
    });

    return { project, members: formattedMembers, updates: updatesData };
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

  // --- MEMBER MANAGEMENT ---
  async addMember(projectId: string, userId: string, projectRole: string) {
    // Kiểm tra xem user đã là thành viên chưa
    const { data: existingMember } = await supabaseAdmin
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      throw new InternalServerErrorException('User is already a member of this project');
    }

    // Thêm thành viên mới
    const { data, error } = await supabaseAdmin
      .from('project_members')
      .insert({
        project_id: Number(projectId),
        user_id: userId,
        project_role: projectRole
      } as any)
      .select('*')
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    
    // Lấy thông tin dự án và email user để gửi thông báo
    try {
      const [{ data: project }, authList] = await Promise.all([
        supabaseAdmin.from('projects').select('id,name,description,status,start_date,end_date').eq('id', projectId).single(),
        (supabaseAdmin as any).auth.admin.listUsers()
      ]);

      const authUsers = (authList?.data?.users || authList?.users) as any[] | undefined;
      const target = (authUsers || []).find((u: any) => u?.id === userId);
      const email = target?.email;

      if (email) {
        const startDate = project?.start_date ? new Date(project.start_date).toLocaleDateString() : undefined;
        const endDate = project?.end_date ? new Date(project.end_date).toLocaleDateString() : undefined;
        const dateStr = startDate && endDate ? `Thời gian: ${startDate} - ${endDate}` : '';

        await sendMail({
          to: email,
          subject: `[Happy Friday] Bạn đã được thêm vào dự án ${project?.name || ''}`,
          html: `
            <div style="font-family: system-ui, Arial, sans-serif;">
              <h2>Chào bạn,</h2>
              <p>Bạn vừa được thêm vào dự án <b>${project?.name || ''}</b> với vai trò <b>${projectRole}</b>.</p>
              <p>${project?.description || ''}</p>
              <p>${dateStr}</p>
              <p>Truy cập hệ thống để xem chi tiết.</p>
              <hr/>
              <small>Đây là email tự động, vui lòng không trả lời.</small>
            </div>
          `,
          text: `Ban da duoc them vao du an ${project?.name || ''} voi vai tro ${projectRole}. ${project?.description || ''}`,
        });
      } else {
        console.warn('[ProjectsService] Could not resolve email for user:', userId);
      }
    } catch (mailErr) {
      console.warn('[ProjectsService] Send mail failed (non-blocking):', mailErr);
    }

    return data;
  }

  async removeMember(projectId: string, userId: string) {
    const { error } = await supabaseAdmin
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Member removed from project' };
  }

  async removeUpdate(projectId: string, updateId: string) {
    const { error } = await supabaseAdmin
      .from('project_updates')
      .delete()
      .eq('project_id', projectId)
      .eq('id', updateId);

    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Update removed from project' };
  }

  async updateProjectUpdate(projectId: string, updateId: string, payload: any) {
    const { error } = await supabaseAdmin
      .from('project_updates')
      .update({
        title: payload.title,
        content: payload.content
      })
      .eq('project_id', projectId)
      .eq('id', updateId);

    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Update updated successfully' };
  }
}


