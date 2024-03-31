export class TypeCompte {
  constructor(
    public id: number,
    public nom: string,
    public numero: string,
    public dateCreation: Date,
    public tauxInteret: number,
    public fraisOuverture: number,
    public fraisTransaction: number,
    public prefixe: string,
    public isDeleted: boolean,
  ) {
  }
}
