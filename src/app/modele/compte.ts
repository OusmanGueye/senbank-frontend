import {TypeCompte} from "./type-compte";
import {User} from "./user";
import {EtatCompte} from "./etat-compte";

export class Compte {
  constructor(
    public id: number,
    public numero: string,
    public solde: number,
    public dateCreation: Date,
    public dateModification: Date,
    public client: string,
    public decovertAutorise: number,
    public typeDeCompte: TypeCompte,
    public user: User,
    public isDeleted: boolean,
    public etatCompte: EtatCompte,
    public dateCreated: Date,
  ) {
  }
}
