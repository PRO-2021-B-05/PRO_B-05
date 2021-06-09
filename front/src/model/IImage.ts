/**
 * interface pour les objets image
 */
export interface Image {
  uuid?: string;
  file?: File;
  title?: string;
  url: string;
  thumbnailUrl?: string;
}
