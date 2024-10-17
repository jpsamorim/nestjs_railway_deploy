import { Song } from "src/songs/song.entity";
import { User } from "src/users/user.entity";
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("playlists")
export class Playlist{

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    // Each playlist with have multiple songs, so:
    @OneToMany(() => Song, (song) => song.playlist)
    songs: Song[];
    // Many playlists can belong to a single unique user, so:
    @ManyToOne(() => User, (user) => user.playlists)
    user: User;
}