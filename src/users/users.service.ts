import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";
import { CreateUserDTO } from "./dto/create-user.dto";
import { v4 as uuid4 } from "uuid";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User> // 1.
    ) {}

    async create(userDTO: CreateUserDTO): Promise<User> {
        
        const user = new User();
        user.firstName = userDTO.firstName;
        user.lastName = userDTO.lastName;
        user.email = userDTO.email;
        user.apiKey = uuid4();
        
        const salt = await bcrypt.genSalt(); // 2.
        user.password = await bcrypt.hash(userDTO.password, salt); // 3.
        const savedUser = await this.userRepository.save(user); // 4.
        delete savedUser.password; // 5.
        return savedUser; // 6.
    }

    // 1. We have imported the User Entity imports: [TypeOrmModule.forFeature([User])], in
    // the UsersModule now we can inject the UsersRepository inside the UsersService.
    // 2. We have created the salt number to encrypt the password
    // 3. We have encrypted the password and set it to userDTO password property
    // 4. You have to save the user by calling the save method from the repository
    // 5. You don't need to send the user password in the response. You have to delete the user
    // password from the user object
    // 6. Finally we need to return the user in the response

    async findOne(
        data: Partial<User>
    ): Promise<User> {
        const user = await this.userRepository.findOneBy({ email: data.email });
        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }

    async findByApiKey(
        apiKey: string
    ): Promise<User>{
        return this.userRepository.findOneBy({apiKey});
    }
        

}