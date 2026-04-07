import { Injectable , ConflictException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity'; // adjust if needed
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@my-app/shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Validate that at least one of email or phone is provided
    if (!createUserDto.email && !createUserDto.phone) {
      throw new BadRequestException('Either email or phone number must be provided');
    }

    // Check for existing users with the same email or phone
    await this.checkForDuplicates(createUserDto.email, createUserDto.phone);

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user data
    const userData = {
      name: createUserDto.name,
      email: createUserDto.email || null,
      phone: createUserDto.phone || null,
      password: hashedPassword,
      role: createUserDto.role || UserRole.CLIENT,
    };

    // Save and return the user
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findByEmailOrPhone(email?: string, phone?: string): Promise<User | null> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    if (email && phone) {
      queryBuilder.where('user.email = :email OR user.phone = :phone', { email, phone });
    } else if (email) {
      queryBuilder.where('user.email = :email', { email });
    } else if (phone) {
      queryBuilder.where('user.phone = :phone', { phone });
    } else {
      return null;
    }

    return await queryBuilder.getOne();
  }

  private async checkForDuplicates(email?: string, phone?: string): Promise<void> {
    const existingUser = await this.findByEmailOrPhone(email, phone);
    
    if (existingUser) {
      if (email && existingUser.email === email) {
        throw new ConflictException('A user with this email already exists');
      }
      if (phone && existingUser.phone === phone) {
        throw new ConflictException('A user with this phone number already exists');
      }
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findStaff(params: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, page = 1, limit = 10 } = params;
    const query = this.userRepository.createQueryBuilder('user')
      .where('user.role = :role', { role: 'staff' });

    if (search) {
      query.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async updateStatus(id: number, isActive: boolean) {
    await this.userRepository.update(id, {  isActive });
    return this.findOne(id);
  }

  async getUserCountsByRole() {
    const counts = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    // Convert to a more usable format
    const roleCounts = counts.reduce((acc, curr) => {
      acc[curr.role] = parseInt(curr.count);
      return acc;
    }, {} as Record<string, number>);

    // Ensure all roles have a count, even if 0
    Object.values(UserRole).forEach(role => {
      if (!(role in roleCounts)) {
        roleCounts[role] = 0;
      }
    });

    return roleCounts;
  }

}
