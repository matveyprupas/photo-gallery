// Define the shape of the photo object from the API
export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
  displayWidth?: number;
  displayHeight?: number;
}

export interface Row {
  photos: Photo[];
  height: number;
}