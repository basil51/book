// src/services/services.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from 'src/entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { User } from 'src/entities/user.entity';  


@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(Service)
    private userRepo: Repository<Service>,

  ) {}

  async create(user: User, dto: CreateServiceDto): Promise<Service> {
  // Load the user's business
  const admin = await this.userRepo.findOne({
    where: { id: user.id },
    relations: ['business'],
  });

  if (!admin?.business) {
    throw new BadRequestException('User is not associated with a business');
  }

  const service = this.serviceRepo.create({
    ...dto,
    business: admin.business, // ✅ set relation explicitly
  });

  return this.serviceRepo.save(service);
}

  async findAll(): Promise<Service[]> {
    return this.serviceRepo.find({
      relations: ['business'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['business'],
    });

    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }

    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });

    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }

    Object.assign(service, updateServiceDto);
    return this.serviceRepo.save(service);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.serviceRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Service #${id} not found`);
    }

    return { message: `Service #${id} removed` };
  }

  async findForBusiness(user: User) {
  const fullUser = await this.userRepo.findOne({
    where: { id: user.id },
    relations: ['business'],
  });

  if (!fullUser?.business) {
    throw new BadRequestException('User is not linked to a business');
  }

  return this.serviceRepo.find({
    where: { business: { id: fullUser.business.id } },
    relations: ['business'],
    order: { created_at: 'DESC' },
  });
}

}
