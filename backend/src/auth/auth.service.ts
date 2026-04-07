import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from '@my-app/shared';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}  

  private generateToken(user: User) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async register(dto: CreateUserDto) {
    const exists = await this.usersRepo.count({ where: { email: dto.email } }) > 0;
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepo.save({
      ...dto,
      password: hashed,
      role: dto.role || UserRole.CLIENT, // Default role
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ 
      where: { email: dto.email },
      select: ['id', 'email', 'password', 'role'] // Only select needed fields
    });
    
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    
    return this.generateToken(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}
