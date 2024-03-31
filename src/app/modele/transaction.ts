import {Compte} from "./compte";
import {EtatTransaction} from "./etat-transaction";

export class Transaction {
  constructor(
    public id: number,
    public dateTransaction: Date,
    public montant: number,
    public motif: string,
    public compteEmetteur: Compte,
    public compteRecepteur: Compte,
    public etatTransaction:EtatTransaction
  ) {
  }
}
