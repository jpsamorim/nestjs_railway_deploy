import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Playlist } from 'src/playlists/playlist.entity';

import{
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity('users')
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: "Jane",
        description: "Provide the first name of the user",
    })
    @Column()
    firstName: string;

    @ApiProperty({
        example: "Doe",
        description: "Provide the last name of the user",
    })
    @Column()
    lastName: string;

    @Column()
    phone: string;

    @ApiProperty({
        example: "jane@gmail.com",
        description: "Provide the email of the user",
    })
    @Column({unique: true})
    email: string;

    @ApiProperty({
        example: "p4ssw0rd",
        description: "Provide the password of the user",
    })
    @Column()
    @Exclude()
    password: string;

    //a user can create many playlists
    @OneToMany(() => Playlist, (playlist) => playlist.user)
    playlists: Playlist[]

    @Column()
    apiKey: string;

}