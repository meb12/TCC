export interface ITableColumn {
  header: string;
  key: string;
  keyArray?: string[];
  type?: string;
  options?: Array<{ value: any; label: string }>;
  action?: (item: any) => void;
  buttons?: ITableButton[];
}

interface ITableButton {
  label: string;
  secondaryLabel?: string;
  conditionSecLabel?: (item: any) => boolean;
  img?: string;
  action: (item: any) => void;
  condition: (item: any) => void;
}
