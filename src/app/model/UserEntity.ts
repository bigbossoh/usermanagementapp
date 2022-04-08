export class UserEntity{
public id?: number;
  public userApplicationId?: string;
    public familyName?: string;
    public remainingName?: string;
    public fullName?: string;
    public username?: string;
    public password?: string;
    public email?: string;
    public profileImageUrl?: string;
    public lastLoginDate?: Date;
    public lastLoginDateDisplay?: Date;
    public joinDate?: Date;
    public role?: string;
    public authorities?:[];
    public active?: boolean;
    public notLocked?: boolean;

    constructor(){
      this.familyName="";
    this.remainingName="";
    this.username="";
    this.email="";
    this.active=false;
    this.notLocked=false;
    this.role="";
    this.authorities=[];
    }

}

