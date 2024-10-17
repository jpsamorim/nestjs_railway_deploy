import { Injectable } from '@nestjs/common';
import { seedData } from 'db/seeds/seed-data';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {

    constructor(private readonly connection: DataSource) {}

    async seed(): Promise<void> {
        const queryRunner = this.connection.createQueryRunner(); //1
        await queryRunner.connect(); //2
        await queryRunner.startTransaction(); //3

        try {
            const manager = queryRunner.manager;
            await seedData(manager);
            await queryRunner.commitTransaction(); //4
        } catch (err) {
            console.log("Error during database seeding:", err);
            await queryRunner.rollbackTransaction(); // 5
        } finally {
            await queryRunner.release(); //6
        }
    }

}

// 1. A Query Runner can be used to manage and work with a single real database data source.
// Each new QueryRunner instance takes a single connection from the connection pool if
// RDBMS supports connection pooling. For databases not supporting connection pools, it uses
// the same connection across data source.
// 2. Use the connect method to actually obtain a connection from the connection pool.
// 3. QueryRunner provides a single database connection. Transactions are organized using
// query runners. Single transactions can only be established on a single query runner. You can
// manually create a query runner instance and use it to manually control transaction state.
// 4. Commit the Transaction
// 5. If we have errors let's rollback changes we made
// 6. Make sure to release it when it is not needed anymore to make it available to the connection
// pool again
