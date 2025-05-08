export interface DatabaseRepositoryInterface<T, CtorDTO> {
    create(dto: CtorDTO): Promise<T>;

    findById(id: string): Promise<T | null>;
  }
