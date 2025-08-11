export type Participant = {
  id: string;
  name: string;
  joined_at: string;
  email: string;
};
export type Plan ={
  id: number;
  price: number;
  name:string;
  description: string;
  tokens: number;
}
export type Testimonial = {
  id: number;
  name: string;
  position: string;
  description: string;
  rating: number;
  image: string;
  created_at: string;
  updated_at: string;
};