import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Scope, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './song.entity';
import { UpdateSongDto } from './dto/update-song.dto';
import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/artists/jwt-artist.guard';

@Controller({
    path: 'songs',
    scope: Scope.REQUEST,
})
// A new instance of SongsController is created for every incoming request, offering a
// more stateless architecture.

export class SongsController {

    constructor(private songsService: SongsService){}

    @Post()
    @UseGuards(JwtArtistGuard)
    create(
        @Body()
        createSongDto: CreateSongDto,
        @Req()
        req
    ): Promise<Song>{
        console.log(req.user);
        const results = this.songsService.create(createSongDto);
        return results;
    }

    @Get()
    findAll(
        @Query(
            'page',
            new DefaultValuePipe(1),
            ParseIntPipe
        ) page: number = 1,
        @Query(
            'limit',
            new DefaultValuePipe(10),
            ParseIntPipe
        ) limit: number = 10,
    ): Promise<Pagination<Song>>{
        
        limit = limit > 100 ? 100: limit;
        try{
            return this.songsService.paginate({
                page,
                limit
            });
        }
        catch(e){
            throw new HttpException(
                'Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,{cause: e},
            );
        } 
    }

    @Get(':id')
    findOne(
        @Param(
            'id',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
            }),
        )
        id: number,
    ): Promise<Song>{
        return this.songsService.findOne(id);
    }

    @Put(":id")
    update(
        @Param(
            'id', ParseIntPipe
        ) id: number,
        @Body() updateSongDto: UpdateSongDto,
    ): Promise<UpdateResult>{
        return this.songsService.update(id, updateSongDto);
    }

    @Delete(":id")
    delete(
        @Param(
            'id',
            ParseIntPipe
        ) id: number
    ): Promise<void>{
        return this.songsService.remove(id);
    }


}
