import { ModalType } from '@shared/model-ui/modal-configuration/modal-types/modal-types';

export interface ModalDataConfiguration<T> {
  type: ModalType;
  title: string;
  titleFallback: string;
  data?: T;
}
