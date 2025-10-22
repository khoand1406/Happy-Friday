import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { sendMail } from 'src/common/mailer'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { ProjectEntity } from './project.entity'
import { ProjectMemberEntity } from './projectmember.entity'
import { ProjectUpdateEntity } from './projectupdate.entity'

// đây là 1 hàm phụ trợ helper function để tìm project theo uuid
async function findProjectById(projectsRepo: Repository<ProjectEntity>, id: string): Promise<ProjectEntity | null> {
  const project = await projectsRepo.findOne({ where: { uuid: id }})
  if(project) return project
  return null 
}

interface ListFilter {
  status?: string
  search?: string
}

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>,
    @InjectRepository(ProjectEntity) private readonly projectsRepo: Repository<ProjectEntity>,
    @InjectRepository(ProjectMemberEntity) private readonly projectMembersRepo: Repository<ProjectMemberEntity>,
    @InjectRepository(ProjectUpdateEntity) private readonly projectUpdatesRepo: Repository<ProjectUpdateEntity>
  ) {}

  async list(page = 1, perPage = 10, filter: ListFilter = {}) {
    // = {} là default value cho filter
    // gọi hàm ko truyền filter thì nó mặc định là rỗng 
    const skip = (page - 1) * perPage
    try {
     const queryBuilder = this.projectsRepo.createQueryBuilder("project")
     // tạo 1 đối tượng queryBuilder để truy vấn dữ liệu trong bảng project 
     if(filter.status) {
      queryBuilder.andWhere('project.status = :status', { status: filter.status })
     }
     if(filter.search) {
      queryBuilder.andWhere('project.name ILIKE :search OR project.description ILIKE :search', { search: `%${filter.search}%`})
     }

     const [items, total] = await queryBuilder
       .orderBy('project.created_at', 'DESC')
       .addOrderBy('project.name', 'ASC')
       .skip(skip)
       .take(perPage)
       .getManyAndCount()
     return { items, total }
    } catch ( e: any) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async detail(id: string) {
    // @Param('id) luôn trả về string, vì URL/HTTP query parameters luôn luôn là chuỗi
    try {
      const project = await findProjectById(this.projectsRepo, id)
      // this.projectsRepo: là repository của entity ProjectEntity
      if(!project) throw new NotFoundException("Project not found")
      const members = await this.projectMembersRepo.find({ where: {project_id: project.id}, relations: ['user', 'user.department']})
      // Mỗi ProjectMember có quan hệ ManyToOne với User (member.user)
      // Mỗi User có quan hệ ManyToOne với Department (user.department)
      // dùng relations để lấy đầy đủ dữ liệu của user và department
      const updates = await this.projectUpdatesRepo.find({ where: {project_id: project.id}, order: { created_at: 'DESC' }})
      const formattedMembers = members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        phone: member.user.phone,
        avatar_url: member.user.avatar_url,
        email: member.user.email,
        department_name: member.user.department?.name || null,
        project_role: member.project_role,
        project_id: member.project_id
      }))
      return { project, members: formattedMembers, updates }
    } catch (e: any) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async create(payload: {name: string, description: string, status: string, start_date?: string, end_date?: string}) {
    try {
      const project = this.projectsRepo.create({
        name: payload.name,
        description: payload.description,
        status: payload.status,
        start_date: payload.start_date ? new Date(payload.start_date) : null,
        end_date: payload.end_date ? new Date(payload.end_date) : null,
        uuid: require('crypto').randomUUID() // Generate UUID for new projects
        // toán tử 3 ngôi nếu có payload.start_date thì new Date(payload.start_date) ngược lại null
      })
      return await this.projectsRepo.save(project)
    } catch (e: any) {
      throw new InternalServerErrorException(e.message)
      // TypeScript không thể đảm bảo lỗi luôn là một Error object — đôi khi nó có thể là string, number, object tuỳ vào code của dev 
    }
  }

  async update(id: string, payload: {name?: string, description?: string, status?: string, start_date?: string, end_date?: string}) {
    const project = await findProjectById(this.projectsRepo, id);
    if(!project) throw new NotFoundException("Project not found")
    const updateData: any = {}
    // đây là 1 object trống ban đầu
    // gán kiểu any để thêm bất kì key sau này ko bị lỗi thuộc tính mới
    if(payload.name !== undefined) updateData.name = payload.name
    if(payload.description !== undefined) updateData.description = payload.description
    if(payload.status !== undefined) updateData.status = payload.status
    if(payload.start_date !== undefined) updateData.start_date = payload.start_date ? new Date(payload.start_date) : null
    if(payload.end_date !== undefined) updateData.end_date = payload.end_date ? new Date(payload.end_date) : null
    Object.assign(project, updateData)
    // Object.assign(target, source)
    // target là object gốc, nơi muốn ghi đè hoặc gộp dữ liệu
    // source object chứa dữ liệu mới để chép vào
    // ở đây là gộp tất cả thuộc tính từ updateData sang project nếu trùng key thì ghi đè giá trị mới
    const updatedProject = await this.projectsRepo.save(project)
    return updatedProject
  }

  async remove(id: string) {
    const project = await findProjectById(this.projectsRepo, id);
    if(!project) throw new NotFoundException("Project not found")
    const result = await this.projectsRepo.delete({ id: project.id })
    if(result.affected === 0) throw new NotFoundException("Project not found")
    // result.affected chính là số lượng bản ghi rows trong cơ sở dữ liệu bị xóa thành công 
    return { message: 'Project deleted', id: project.id }
  }

  // tabfeeds cho 1 project cụ thể 
  async listUpdates(projectId: string) {
    try {
      const project = await findProjectById(this.projectsRepo, projectId);
      if(!project) throw new NotFoundException("Project not found")
      return await this.projectUpdatesRepo.find({
        where: { project_id: project.id },
        order: { created_at: 'DESC' }
      })
    } catch (e: any) {
      throw new InternalServerErrorException(e.message)
      // đại diện cho lỗi server như kiểu lỗi db, query
    }
  }

  async updateStatus(projectId: string, userId: string,status: string) {
    const project = await findProjectById(this.projectsRepo, projectId);
    if(!project) throw new NotFoundException("Project not found")
    const member = await this.projectMembersRepo.findOne({ where: { project_id: project.id, user_id: userId }})
    if(!member) throw new NotFoundException("You are not a member of this project")
    const role = String(member.project_role).toLowerCase()
    const canUpdate = role === 'owner' || role === 'project manager'
    if(!canUpdate) throw new ForbiddenException("You are not authorized to update the status of this project")
    project.status = status
    return await this.projectsRepo.save(project)
  }

  async addMember(projectId: string, userId: string, projectRole: string) {
    const project = await findProjectById(this.projectsRepo, projectId);
    if(!project) throw new NotFoundException("Project not found")
    const existing = await this.projectMembersRepo.findOne({ where: { project_id: project.id, user_id: userId }})
    if(existing) throw new ConflictException("User is already a member of this project")
    const member = this.projectMembersRepo.create({
      project_id: project.id,
      user_id: userId,
      project_role: projectRole
    })
    const savedMember = await this.projectMembersRepo.save(member)
    try {
      const [projectData, user] = await Promise.all([
        // Promise.add([]) chạy 2 lời gọi bất đồng bộ cùng 1 lúc và đợi cả 2 hoàn thành nhanh hơn so với await a; await b;
        this.projectsRepo.findOne({ where: { id: project.id} }),
        this.usersRepo.findOne({ where: { id: userId }})
      ])
      const email = user?.email?.trim()
      if(email && projectData) {
        const startDate = projectData.start_date ? String(projectData.start_date).slice(0, 10) : undefined
        const endDate = projectData.end_date ? String(projectData.end_date).slice(0, 10) : undefined
        const dateStr = startDate && endDate ? `Thời gian: ${startDate} - ${endDate}` : ''
        await sendMail({
          to: email,
          subject: `[Happy Friday] Bạn đã được thêm vào dự án ${projectData.name || ''}`,
          html: `
            <div style="font-family: system-ui, Arial, sans-serif;">
              <h2>Chào bạn,</h2>
              <p>Bạn vừa được thêm vào dự án <b>${projectData.name || ''}</b> với vai trò <b>${projectRole}</b>.</p>
              <p>${projectData.description || ''}</p>
              <p>${dateStr}</p>
              <p>Truy cập hệ thống để xem chi tiết.</p>
              <hr/>
              <small>Đây là email tự động, vui lòng không trả lời.</small>
            </div>
          `,
          text: `Ban da duoc them vao du an ${projectData.name || ''} voi vai tro ${projectRole}. ${projectData.description || ''}`,
        })
      } else {
        console.log('Count not send email for users:', userId)
      }
    } catch (mailErr) {
      console.warn('Send main failed', mailErr)
    }
    return savedMember
  }

  async removeMember(projectId: string, userId: string) {
    const project = await findProjectById(this.projectsRepo, projectId);
    if(!project) throw new NotFoundException("Project not found")
    const result = await this.projectMembersRepo.delete({ project_id: project.id, user_id: userId })
    if(result.affected === 0) return { message: 'Member already removed or not found' }
    return { message: 'Member removed successfully', projectId: project.id, userId: userId }
  }  

  async updateProjectUpdate(projectId: string, updateId: string, payload: any) {
    const project = await findProjectById(this.projectsRepo, projectId);
    if(!project) throw new NotFoundException("Project not found")
    const update = await this.projectUpdatesRepo.findOne({ where: { id: parseInt(updateId), project_id: project.id }})
    if(!update) throw new NotFoundException("Update not found")
    update.title = payload.title
    // vì payload có :any nên cho phép truyền bao nhiêu thuộc tính cũng được 
    update.content = payload.content
    await this.projectUpdatesRepo.save(update)
    return { message: 'Update updated successfully', id: parseInt(updateId) }
  }

  async createUpdate(projectId: string, authorId: string | null, payload: { title: string; content: string }) {
    try {
      const project = await findProjectById(this.projectsRepo, projectId);
      if (!project) throw new NotFoundException('Project not found')
      const update = this.projectUpdatesRepo.create({
        project_id: project.id,
        title: payload.title,
        content: payload.content,
        author_id: authorId || null,
      })
      return await this.projectUpdatesRepo.save(update)
    } catch (e: any) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async removeUpdate(projectId: string, updateId: string) {
    const project = await findProjectById(this.projectsRepo, projectId);
    if(!project) throw new NotFoundException("Project not found")
    const result = await this.projectUpdatesRepo.delete({ id: parseInt(updateId), project_id: project.id })
    if (result.affected === 0) throw new NotFoundException('Update not found')
    return { message: 'Update removed successfully', id: parseInt(updateId) }
  }
}




