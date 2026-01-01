export interface ImagePathType {
  TESTAMENTS: string;
  USERS: string;
  ECOMMERCE: string;
  PROFILE: string;
  BLOG: string;
}

export let ImagePath: ImagePathType = {
  TESTAMENTS: 'testaments',
  USERS: 'users',
  ECOMMERCE: 'e-commerce',
  PROFILE: 'profile',
  BLOG: 'blog'
};

// ==============================|| NEW URL - GET IMAGE URL ||============================== //

export function getImageUrl(name: string, path: string): string {
  return new URL(`/src/assets/images/${path}/${name}`, import.meta.url).href;
}