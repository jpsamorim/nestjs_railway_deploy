import { plainToInstance } from "class-transformer";
import { IsEnum, IsNumber, IsString, validateSync } from "class-validator";

enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
    Provision = "provision",
}

class EnvironmentVariables {

@IsEnum(Environment, {message: 'NODE_ENV must be development, production, test, or provision'})
NODE_ENV: Environment;

@IsNumber()
PORT: number;

@IsString()
DB_HOST: string;

@IsString()
USERNAME: string;

@IsString()
PASSWORD: string;

@IsString()
DB_NAME: string;

@IsString()
SECRET: string;

@IsNumber()
DB_PORT: number;

}

export function validate(
    config: Record<string, unknown>
){
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        {
            enableImplicitConversion: true,
        }
    );

    const errors = validateSync(
        validatedConfig,
        {
            skipMissingProperties: false,
        }
    );

    if(errors.length > 0){
        throw new Error(errors.toString());
    }
    return validatedConfig;
}

