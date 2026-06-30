using MyProject.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace MyProject.Permissions;

public class MyProjectPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(MyProjectPermissions.GroupName);

        var booksPermission = myGroup.AddPermission(MyProjectPermissions.Books.Default, L("Permission:Books"));
        booksPermission.AddChild(MyProjectPermissions.Books.Create, L("Permission:Books.Create"));
        booksPermission.AddChild(MyProjectPermissions.Books.Edit, L("Permission:Books.Edit"));
        booksPermission.AddChild(MyProjectPermissions.Books.Delete, L("Permission:Books.Delete"));

        var authorsPermission = myGroup.AddPermission(MyProjectPermissions.Authors.Default, L("Permission:Authors"));
        authorsPermission.AddChild(MyProjectPermissions.Authors.Create, L("Permission:Authors.Create"));
        authorsPermission.AddChild(MyProjectPermissions.Authors.Edit, L("Permission:Authors.Edit"));
        authorsPermission.AddChild(MyProjectPermissions.Authors.Delete, L("Permission:Authors.Delete"));
        //Define your own permissions here. Example:
        //myGroup.AddPermission(MyProjectPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<MyProjectResource>(name);
    }
}
