import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { BusinessAdmin } from 'src/entities/business-admin.entity';
import { CreateBusinessAdminDto } from './dto/create-business-admin.dto';
import { UpdateBusinessAdminDto } from './dto/update-business-admin.dto';
import { Business } from 'src/entities/business.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BusinessAdminsService {
  constructor(
    @InjectRepository(BusinessAdmin)
    private readonly businessAdminsRepo: Repository<BusinessAdmin>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createDto: CreateBusinessAdminDto) {
    return this.businessAdminsRepo.save(createDto);
  }

  async findAll() {
    return this.businessAdminsRepo.find({ relations: ['user', 'business'] });
  }

  async findOne(where: FindOptionsWhere<BusinessAdmin>) {
    return this.businessAdminsRepo.findOne({ where, relations: ['user', 'business'] });
  }

  async update(id: number, updateDto: UpdateBusinessAdminDto) {
    return this.businessAdminsRepo.update(id, updateDto);
  }

  async remove(id: number) {
    await this.businessAdminsRepo.delete(id);
  }

  async findAdminsByBusiness(businessId: number) {
    return this.businessAdminsRepo.find({
      where: { business: { id: businessId } },
      relations: ['user'],
    });
  }

  async updateMyBusiness(user: User, updateBusinessDto: CreateBusinessAdminDto) {
    const businessAdmin = await this.businessAdminsRepo.findOne({ 
      where: { user: { id: user.id } },
      relations: ['business']
    });
    if (!businessAdmin) throw new NotFoundException('Business admin not found');
    
    return this.businessAdminsRepo.save({
      ...businessAdmin,
      ...updateBusinessDto
    });
  }
}