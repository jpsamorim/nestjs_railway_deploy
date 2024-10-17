import { Inject, Injectable, Scope } from '@nestjs/common';
import { Connection } from 'src/common/constants/connection';
import { Song } from './song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';


@Injectable({
    scope: Scope.TRANSIENT
})

export class SongsService {

    private readonly songs = [];

    constructor(
        @Inject("CONNECTION")
        connection: Connection,
        @InjectRepository(Song)
        private songRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,
        // private connection: Connection**
        
        // **Since the connection is provided using a custom token ("CONNECTION"),
        // this line alone won’t work unless you also use the @Inject() decorator to tell NestJS what to
        // inject for the Connection type.
    ){
        console.log("Connection String", connection.CONNECTION_STRING);
    }

    async paginate(
        options: IPaginationOptions
    ): Promise<Pagination<Song>>{
        const queryBuilder = this.songRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.releasedDate', 'DESC');
        return paginate<Song>(this.songRepository, options);
    }

    async create(songDTO: CreateSongDto): Promise<Song>{
        const song = new Song();
        song.title = songDTO.title;
        song.artists = songDTO.artists;
        song.duration = songDTO.duration;
        song.lyrics = songDTO.lyrics;
        song.releasedDate = songDTO.releasedDate;

        const artists = await this.artistRepository.find({
            where: {
                id: In(songDTO.artists),
            },
        });
        song.artists = artists;


        return await this.songRepository.save(song);

        
    }

    findAll(): Promise<Song[]>{
        return this.songRepository.find();
    }

    
    findOne(id: number): Promise<Song>{
        return this.songRepository.findOneBy({id});
    }

    async remove(id: number): Promise<void>{
        await this.songRepository.delete(id);
    }

    async update(
        id: number,
        recordToUpdate: UpdateSongDto
    ): Promise<UpdateResult>{
        return this.songRepository.update(id, recordToUpdate);
    }


}
