import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  //inyeccion de dependencias
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService

  ){

    this.defaultLimit = configService.get<number>('defaultLimit');
    console.log({defaultLimit: configService.get<number>('defaultLimit')});
    
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      // Creando inserciones
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      this.handleExceptions(error)
    }

  }

  findAll(PaginationDto: PaginationDto) {
  
    const {limit = this.defaultLimit, offset= 0} = PaginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1 //ascendente
      }) //ordenar alfabeticamente
      .select('-__v')
    }

  //Busca por el numero
  async findOne(term: string) {
    let pokemon: Pokemon;
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    // Verificación por MongoID
    if( !pokemon && isValidObjectId(term) ){
      pokemon = await this.pokemonModel.findById(term)
    }
    // Verificación por Name
    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()})
    }

    
    if(!pokemon) throw new NotFoundException(`Pokemon no encontrado id:'${term}'`)
    return pokemon;
  }

  async update( term: string, updatePokemonDto: UpdatePokemonDto) {
    //validar que el pokemon exista
    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()

      try {
        await pokemon.updateOne(updatePokemonDto, {new: true})
        return {...pokemon.toJSON(), ...updatePokemonDto};
      
      } catch (error) {
        this.handleExceptions(error)
      }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id)
    // await pokemon.deleteOne()
    //const resultado = await this.pokemonModel.findByIdAndDelete(id);

    const {deletedCount } = await this.pokemonModel.deleteOne({ _id: id})
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    }

    return
  }

  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Ya existe el pokemon en la Base de Datos: ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Can´t create Pokemon - Check server logs`)
  }
}
