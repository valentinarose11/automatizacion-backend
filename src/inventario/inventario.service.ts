import { MateriaPrima } from './../materia-prima/model/materia-prima.model';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { Inventario } from './model/inventario.model';

@Injectable()
export class InventarioService {

  includes: any
  attributes: any
  constructor(
    @InjectModel(Inventario)
    private inventarioModel: typeof Inventario) {
      this.inicilizarCampos();
     }

  inicilizarCampos() {
    this.cargarAttributes()
    this.cargarIncludes();
  }

  cargarAttributes() {
    this.attributes = [
      'id',
      'cantidad',      
    ]
  }

  cargarIncludes() {
    this.includes = [
      {
        model: MateriaPrima,
        attributes: ['id', 'descripcion'],        
      }
    ]
  }

  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    let inventarioDB = await this.inventarioModel.findOne({
      where: {
        materia_prima_id: createInventarioDto.materia_prima_id
      }
    })
    if(inventarioDB) {
      return await this.updateInvetario(inventarioDB,createInventarioDto);
    } else {
      const inventario = new Inventario();
      inventario.materia_prima_id = createInventarioDto.materia_prima_id;
      inventario.cantidad = createInventarioDto.cantidad;
      await inventario.save();
      return this.findOne(inventario.id)
    }
  }

  async updateInvetario(inventario: Inventario,createInventarioDto: CreateInventarioDto) {
    inventario.cantidad = createInventarioDto.cantidad;
    await inventario.save();
    return this.findOne(inventario.id)
  }

  async findAll(): Promise<Inventario[]> {
    return this.inventarioModel.findAll({
      include: this.includes,
      attributes: this.attributes
    });
  }

  async findOne(id: string): Promise<Inventario> {
    return this.inventarioModel.findByPk(id, {
      include: this.includes,
      attributes: this.attributes
    });
  }

  async update(id: string, createInventarioDto: CreateInventarioDto) {
    const inventario = await this.findOne(id);
    if (inventario) {
      return await this.updateInvetario(inventario, createInventarioDto);
    } else {
      throw new NotFoundException({ error: "ID no existe", status: 404 }, "ID no existe");
    }
  }

  async delete(id: string): Promise<void> {
    const inventario = await this.findOne(id);
    if (inventario) {
      await inventario.destroy();
    } else {
      throw new NotFoundException({ error: "ID no existe", status: 404 }, "ID no existe");
    }
  }
}
