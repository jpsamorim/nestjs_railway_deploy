import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from 'src/artists/artist.entity';


// const mockSongsService = {
//   findAll() {
//     return [{
//       id: 1,
//       title: "Lasting Lover"
//     }];
//   },
// };

@Module({
  controllers: [SongsController],

  // syntax 1:
  //providers: [SongsService]

  //syntax 2:
  // providers: [{
  //   provide: SongsService,
  //   useClass: SongsService,
  // }]

  //syntax 3: **
  // providers: [
  //   SongsService,
  //   {
  //     provide: SongsService,
  //     useValue: mockSongsService,
  //   }
  // ]
  
  // ** The useValue syntax is useful for injecting a constant value, putting an external library
  // into the Nest container, or replacing a real implementation with a mock object. Let’s
  // say you’d like to force Nest to use a mock SongsService for testing purposes.
  // When you send GET request to localhost:3000/songs it will run the findAll()
  // method from mockSongsService instead of origianl SongsService

  providers: [
    SongsService,
    {
      provide: 'CONNECTION',
      useValue: connection,
    },
    //The connection object can now be injected into any controller or service within the SongsModule.
  ],

  imports: [
    TypeOrmModule.forFeature([Song, Artist])
  ],
  
})

export class SongsModule {}
