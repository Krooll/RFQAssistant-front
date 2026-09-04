import { ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';

export interface ModalDataConfiguration<T> {
  type: ModalTypes;
  data?: T;
}
