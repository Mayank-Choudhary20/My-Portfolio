import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admins')
  getAllAdmins() {
    return this.authService.getAllAdmins();
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  register(@Body() body: { email: string; password: string }) {
    return this.authService.createAdmin(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admins/:id')
  deleteAdmin(@Param('id') id: string) {
    return this.authService.deleteAdmin(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @Request() req: { user: { id: string } },
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );
  }
}