export interface CreateRecetaDto {
  referencia_producto_id: number;
  tipo_producto_id: number;
  tiempo_premezclado: number;
  tiempo_precalentamiento: number;
  tiempo_mezclado: number;
  temperatura_precalentamiento: number;
  temperatura_calentamiento: number;
  densidad: number;
}
