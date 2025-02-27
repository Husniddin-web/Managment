import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  private async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return { refresh_token: refreshToken, access_token: accessToken };
  }

  async loginUser(loginDot: LoginDto, res: Response) {
    const user = await this.userService.findByEmail(loginDot.email);

    if (!user) {
      throw new UnauthorizedException("Email or password notogri");
    }

    const isMatched = await bcrypt.compare(loginDot.password, user.password);

    if (!isMatched) {
      throw new UnauthorizedException("Email yoki parol notogr");
    }

    const tokens = await this.generateToken(user);

    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: 129600000,
    });

    return { accessToken: tokens.access_token };
  }

  async logOut(refreshToken: string, res: Response) {
    const isVerify = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!isVerify) {
      throw new UnauthorizedException();
    }

    res.clearCookie("refresh_token");
    const response = { message: "Sign Out succesfully" };

    return response;
  }
}
