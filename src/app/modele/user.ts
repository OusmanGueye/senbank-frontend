export class User {
  constructor(
    public id: number,
    public name: string,
    public username: string,
    public password: string,
    public email: string,
    public enabled: boolean,
    public enable: boolean,
    public dateCreated: Date,
    public roles: string[]) {
  }
}
