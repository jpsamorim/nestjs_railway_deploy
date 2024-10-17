import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Playlist } from "./playlist.entity";
import { Song } from "src/songs/song.entity";
import { User } from "src/users/user.entity";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";


@Injectable()
export class PlaylistsService{
    
    constructor(
        @InjectRepository(Playlist)
        private playlistRepo: Repository<Playlist>,
        @InjectRepository(Song)
        private songsRepo: Repository<Song>,
        @InjectRepository(User)
        private userRepo: Repository<User>
        
    ){}

    async create(
        playlistDTO: CreatePlaylistDto
    ): Promise<Playlist>{
        const playlist = new Playlist();
        playlist.name = playlistDTO.name;
        // songs will be the array of IDs that we are getting from the DTO object
        //const songs = await this.songsRepo.findByIds(playListDTO.songs);
        const songs = await this.songsRepo.find({
            where: {
                id: In(playlistDTO.songs),
            },
        });

        //Set the relation for the songs with the playlist entity
        playlist.songs = songs;
        // A user will be the ID of the user we are getting from the request
        // When we implemented the user authentication this id will become the logged
        // in user id
        const user = await this.userRepo.findOneBy({ id: playlistDTO.user });
        playlist.user = user;
        return this.playlistRepo.save(playlist);

        

    }
}