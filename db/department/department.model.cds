namespace com.bonus.department;

entity Department {
    key ID:             UUID @(Core.Computed : true);
    name:               String;
    department_bonus:   Double;
}