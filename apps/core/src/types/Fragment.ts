export interface Fragment {
  name?: string;
  type: 'receive' | 'constructor' | 'fallback';
  inputs: Array<{
    name?: string;
    type: string;
  }>;
}
