import { Artist } from "src/artists/artist.entity";
import { Playlist } from "src/playlists/playlist.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("songs")

export class Song{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    // @Column('varchar', {array: true})
    // artists: string[];
    @Column({type: "date"})
    releasedDate: Date;
    @Column({type: "text"})
    lyrics: string;
    @Column({type: 'time'})
    duration: Date;
    @ManyToMany(() => Artist, (artist) => artist.songs, {cascade: true})
    @JoinTable({name: "songs_artists"})
    artists: Artist[];
    // Many songs can belong to the playlist for each unique user, so:
    @ManyToOne(() => Playlist, (playlist) => playlist.songs)
    playlist: Playlist;
}
