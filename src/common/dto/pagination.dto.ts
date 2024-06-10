import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{

    // reestricciones
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number;

}


// ? = opcional