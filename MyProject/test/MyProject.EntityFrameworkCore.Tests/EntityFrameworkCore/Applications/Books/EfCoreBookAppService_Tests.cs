using MyProject.Books;
using Xunit;

namespace MyProject.EntityFrameworkCore.Applications.Books;

[Collection(MyProjectTestConsts.CollectionDefinitionName)]
public class EfCoreBookAppService_Tests : BookAppService_Tests<MyProjectEntityFrameworkCoreTestModule>
{

}