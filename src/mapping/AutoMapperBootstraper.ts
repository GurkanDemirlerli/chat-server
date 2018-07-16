// import 'automapper-ts';
// import { FriendshipRequestCreateResult } from '../models/DataTransferObjects';

// export class AutoMapperBootstraper {
//     constructor() {
//     }

//     public init() {
//         // automapper.initialize((config: AutoMapperJs.IConfiguration) => {
//         //     config.createMap('Book', 'BookViewModel')
//         //         .forMember('PublisherName', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom('publisher.Name'));

//         //     config.createMap('Branch', 'BranchViewModel');
//         //     config.createMap('Borrower', 'BorrowerViewModel');
//         //     config.createMap('Publisher', 'PublisherViewModel');
//         //     config.createMap('Author', 'AuthorViewModel');

//         // });

//         automapper.initialize((config: AutoMapperJs.IConfiguration) => {
//             config.createMap('IFriendRequest', 'FriendshipRequestCreateResult')
//                 .forMember('_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('_id'); })
//                 .forMember('_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('_id'); })
//                 .forMember('_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('_id'); })
//                 .forMember('_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('_id'); })
//                 .forMember('_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('_id'); })
//                 .forMember('_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('_id'); })
//                 .convertToType(FriendshipRequestCreateResult)
//         });
//     }
// }


// import { IMappingService } from "../Interfaces/Services/IMappingService";
// import { IEnergyCertificateModel } from "../Interfaces/Models/IEnergyCertificateModel";
// import { ILanguageViewModel } from "../Interfaces/Models/ILanguageViewModel";
// import { IPropertyTypeModel } from "../Interfaces/Models/IPropertyTypeModel";
// import { IPropertyViewModel } from "../Interfaces/Models/IPropertyViewModel";
// import { IUserModel } from "../Interfaces/Models/IUserModel";
// import { IPhotoViewModel } from "../Interfaces/Models/IPhotoViewModel";
// import { IDNameModel } from "../Interfaces/Models/IDNameModel";
// import { IExtraAttributeModel } from "../Interfaces/Models/IExtraAttributeModel";
// import { ICompanyViewModel } from "../Interfaces/Models/ICompanyViewModel";

// export default class MappingService implements IMappingService {

//     constructor() {
//         this.initializeMappings();
//     }

//     initializeMappings() {

//         //#region Language Dto to LanguageViewModel Mapper
//         automapper.createMap("LanguageDto", "LanguageViewModel")
//             .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('id') })
//             .forMember('name', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('name') });

//         //#endregion
//         //#region Comment Dto to CommentViewModel Mapper
//         automapper.createMap("CommentDto", "CommentViewModel")
//             .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('id') })
//             .forMember('message', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('message') })
//             .forMember('language', (opts: AutoMapperJs.IMemberConfigurationOptions) => { return automapper.map("AnyDto", "IdNameModel", (<OH.WebSite.Models.DTOs.Response.Get.ICommentDto>opts.sourceObject).language) });

//         //#endregion
//         //#region Property type Dto to property type viewModel Mapper
//         automapper.createMap("PropertyTypeDto", "PropertyTypeViewModel")
//             .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('id') })
//             .forMember('name', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('name') })
//             .forMember('propertySubTypes', (opts: AutoMapperJs.IMemberConfigurationOptions) => { return automapper.map("AnyDto", "IdNameModel", (<OH.WebSite.Models.DTOs.Response.Get.IPropertyTypeDto>opts.sourceObject).propertySubTypes) });

//         //#endregion
//         //#region Property Dto to property viewModel Mapper
//         automapper.createMap("PropertyDto", "PropertyViewModel")
//             .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('id') })
//             .forMember('action',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return automapper.map("AnyDto",
//                         "IdNameModel",
//                         (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).action)
//                 })
//             .forMember('address', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('address') })
//             .forMember('basicHeatingType',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).basicHeatingType
//                         ? automapper.map("ExtraAttributeDto", "ExtraAttributeModel", opts.sourceObject.basicHeatingType)
//                         : null;
//                 })
//             .forMember('buildingCharacteristics',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).buildingCharacteristics
//                         ? automapper.map("AnyDto", "IdNameModel", opts.sourceObject.buildingCharacteristics)
//                         : [];
//                 })
//             .forMember('checked', (opts: AutoMapperJs.IMemberConfigurationOptions) => { return false; })
//             .forMember('comments',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return opts.sourceObject.comments
//                         ? automapper.map("CommentDto", "CommentViewModel", opts.sourceObject.comments)
//                         : [];
//                 })
//             .forMember('constructionDate',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return this.resolveDate((<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject)
//                         .constructionDate);
//                 })
//             .forMember('contactEmails',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return opts.sourceObject.contactEmails ? opts.sourceObject.contactEmails.split(",") : []
//                 })
//             .forMember('contactPhones',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return opts.sourceObject.contactPhones ? opts.sourceObject.contactPhones.split(",") : []
//                 })
//             .forMember('correctPosition',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('correctPosition') })
//             .forMember('createdDate',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return this.resolveDate((<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject)
//                         .createdDate);
//                 })
//             .forMember('description', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('description') })
//             .forMember('doorFrameType',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).doorFrameType
//                         ? automapper.map("ExtraAttributeDto", "ExtraAttributeModel", opts.sourceObject.doorFrameType)
//                         : null;
//                 })
//             .forMember('electricityPowerType',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).electricityPowerType
//                         ? automapper.map("ExtraAttributeDto",
//                             "ExtraAttributeModel",
//                             opts.sourceObject.electricityPowerType)
//                         : null;
//                 })
//             .forMember('energyCertificate',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('energyCertificate') })
//             .forMember('energyEfficiency',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).energyEfficiency
//                         ? automapper.map("AnyDto",
//                             "IdNameModel",
//                             (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).energyEfficiency)
//                         : null;
//                 })
//             .forMember('expirationDate',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return this.resolveDate((<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject)
//                         .expirationDate);
//                 })
//             .forMember('extraAttributes',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).extraAttributes
//                         ? automapper.map("ExtraAttributeDto", "ExtraAttributeModel", opts.sourceObject.extraAttributes)
//                         : [];
//                 })
//             .forMember('floorLevel',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).floorLevel
//                         ? automapper.map("AnyDto",
//                             "IdNameModel",
//                             (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).floorLevel)
//                         : null;
//                 })
//             .forMember('floorLevelTo',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).floorLevelTo
//                         ? automapper.map("AnyDto",
//                             "IdNameModel",
//                             (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).floorLevelTo)
//                         : null;
//                 })
//             .forMember('floorType',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).floorType
//                         ? automapper.map("ExtraAttributeDto", "ExtraAttributeModel", opts.sourceObject.floorType)
//                         : null;
//                 })
//             .forMember('hasPublicWc',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('hasPublicWc') })
//             .forMember('heatingType',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).heatingType
//                         ? automapper.map("ExtraAttributeDto", "ExtraAttributeModel", opts.sourceObject.heatingType)
//                         : null;
//                 })
//             .forMember('latitude', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('latitude') })
//             .forMember('longitude',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('longitude') })
//             .forMember('likes', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('likes') })
//             .forMember('likedByTheCallerUser', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('likedByTheCallerUser') })
//             .forMember('numberOfRooms',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('numberOfRooms') })
//             .forMember('numberOfBathrooms',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('numberOfBathrooms') })
//             .forMember('numberOfClosets',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('numberOfClosets') })
//             .forMember('numberOfLevels',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('numberOfLevels') })
//             .forMember('numberOfRooms',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('numberOfRooms') })
//             .forMember('numberOfWc',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('numberOfWc') })
//             .forMember('parkingType',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).parkingType
//                         ? automapper.map("AnyDto",
//                             "IdNameModel",
//                             (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).parkingType)
//                         : null;
//                 })
//             .forMember('photos',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return automapper.map("PhotoDto",
//                         "PhotoModel",
//                         (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).photos)
//                 })
//             .forMember('price', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('price') })
//             .forMember('priceHide', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('priceHide') })
//             .forMember('propertyCondition',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).propertyCondition
//                         ? automapper.map("AnyDto",
//                             "IdNameModel",
//                             (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).propertyCondition)
//                         : null;
//                 })
//             .forMember('published',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('published') })
//             .forMember('renovationDate', (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                 return this.resolveDate((<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).renovationDate);
//             })
//             .forMember('reportAbuseData', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('reportAbuseData') })
//             .forMember('reportWrongAddress', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('reportWrongAddress') })
//             .forMember('size', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('size') })
//             .forMember('subType',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).subType
//                         ? automapper.map("AnyDto",
//                             "IdNameModel",
//                             (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).subType)
//                         : null;
//                 })
//             .forMember('type',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).type
//                         ? automapper.map("AnyDto",
//                             "IdNameModel",
//                             (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).type)
//                         : null;
//                 })
//             .forMember('user',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).user
//                         ? automapper.map("AnyDto",
//                             "IdNameModel",
//                             (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).user)
//                         : null;
//                 })
//             .forMember('views', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('views') })
//             .forMember('viewType',
//                 (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                     return (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).viewType
//                         ? automapper.map("AnyDto",
//                             "IdNameModel",
//                             (<OH.WebSite.Models.DTOs.Response.Get.IPropertyDto>opts.sourceObject).viewType)
//                         : null;
//                 })
//             .forMember('highlight', (opts: AutoMapperJs.IMemberConfigurationOptions) => { return false; });


//         //#endregion
//         //#region energyCertificateDto to EnergyCertificateModel Mapper
//         automapper.createMap("EnergyCertificateDto", "EnergyCertificateModel")
//             .forMember('address', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('address') })
//             .forMember('energyEfficiency', (opts: AutoMapperJs.IMemberConfigurationOptions) => { return automapper.map("AnyDto", "IdNameModel", (<OH.WebSite.Models.DTOs.Response.Get.IEnergyCertificateDto>opts.sourceObject).energyEfficiency) });

//         //#endregion
//         //#region ExtraAttributeDto to ExtraAttributeModel Mapper
//         automapper.createMap("ExtraAttributeDto", "ExtraAttributeModel")
//             .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('id') })
//             .forMember('name', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('name') })
//             .forMember('iconClass', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('iconClass') })
//             .forMember('propertyTypeIds', (opts: AutoMapperJs.IMemberConfigurationOptions) => {
//                 return automapper.map("AnyDto", "IdModel", (<OH.WebSite.Models.DTOs.Response.Get.IExtraAttributeDto>opts.sourceObject).propertyTypeIds);
//             })
//             .forMember('checked', (opts: AutoMapperJs.IMemberConfigurationOptions) => { return false; });

//         //#endregion
//         //#region User Dto to UserModel Mapper
//         automapper.createMap("UserDto", "UserModel")
//             .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('id') })
//             .forMember('email', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('email') })
//             .forMember('isVerified', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('isVerified') });

//         //#endregion
//         //#region Photo Dto to PhotoModel Mapper
//         automapper.createMap("PhotoDto", "PhotoModel")
//             .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('id') })
//             .forMember('description', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('name') })
//             .forMember('uploadedFileName', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('uploadedFileName') })
//             .forMember('thumb100', (opts: AutoMapperJs.IMemberConfigurationOptions) => { return opts.sourceObject.uploadedThumbnailFileUrl + "Thumb_100_" + opts.sourceObject.uploadedFileName })
//             .forMember('thumb200', (opts: AutoMapperJs.IMemberConfigurationOptions) => { return opts.sourceObject.uploadedThumbnailFileUrl + "Thumb_200_" + opts.sourceObject.uploadedFileName })
//             .forMember('thumb', (opts: AutoMapperJs.IMemberConfigurationOptions) => { return opts.sourceObject.uploadedThumbnailFileUrl + "Thumb_200_" + opts.sourceObject.uploadedFileName })
//             .forMember('img', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('uploadedFileUrl') });;

//         //#endregion
//         //#region Any Dto to IdNameModel Mapper
//         automapper.createMap("AnyDto", "IdNameModel")
//             .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('id') })
//             .forMember('name', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('name') });

//         //#endregion
//         //#region Any Dto to IdModel Mapper
//         automapper.createMap("AnyDto", "IdModel")
//             .forMember('id', (opts: AutoMapperJs.IMemberConfigurationOptions) => { opts.mapFrom('id') });

//         //#endregion
//     }

//     languageDtoToLanguageModel(dtoList: OH.WebSite.Models.DTOs.Response.Get.ILanguageDto[]): ILanguageViewModel[] {
//         if (!dtoList) {
//             return [];
//         }
//         return automapper.map("LanguageDto", "LanguageViewModel", dtoList);
//     }

//     propertyTypeDtoToPropertyTypeModel(dtoList: OH.WebSite.Models.DTOs.Response.Get.IPropertyTypeDto[]): IPropertyTypeModel | IPropertyTypeModel[] {
//         if (!dtoList) {
//             return [];
//         }
//         return automapper.map("PropertyTypeDto", "PropertyTypeViewModel", dtoList);
//     }

//     propertyDtoToPropertyViewModel(dto: OH.WebSite.Models.DTOs.Response.Get.IPropertyDto | OH.WebSite.Models.DTOs.Response.Get.IPropertyDto[]): IPropertyViewModel | IPropertyViewModel[] {

//         return automapper.map("PropertyDto", "PropertyViewModel", dto);
//     }


//     companyDtoToCompanyViewModel(dto: OH.WebSite.Models.DTOs.Response.Get.ICompanyDto | OH.WebSite.Models.DTOs.Response.Get.ICompanyDto[]): ICompanyViewModel | ICompanyViewModel[] {

//         return automapper.map("CompanyDto", "CompanyViewModel", dto);
//     }



//     propertyDtoToPropertyListViewModel(dto: OH.WebSite.Models.DTOs.Response.Get.IPropertyDto): IPropertyViewModel {

//         let result = automapper.map("PropertyDto", "PropertyListViewModel", dto);

//         result.renovationDate = dto.renovationDate.getFullYear();
//         result.constructionDate = dto.constructionDate.getFullYear();

//         return result;
//     }

//     energyCertificateDtoToEnergyCertificateModel(dtoList: OH.WebSite.Models.DTOs.Response.Get.IEnergyCertificateDto[]): IEnergyCertificateModel | IEnergyCertificateModel[] {
//         if (!dtoList) {
//             return [];
//         }
//         return automapper.map("PropertyTypeDto", "PropertyTypeViewModel", dtoList);
//     }

//     mapToIdNameModel(dtoList: any | any[]): IDNameModel | IDNameModel[] {
//         return automapper.map("AnyDto", "IdNameModel", dtoList);
//     }

//     extraAttributeDtoToExtraAttributeModel(dto: OH.WebSite.Models.DTOs.Response.Get.IExtraAttributeDto[] | OH.WebSite.Models.DTOs.Response.Get.IExtraAttributeDto): IExtraAttributeModel | IExtraAttributeModel[] {
//         return automapper.map("ExtraAttributeDto", "ExtraAttributeModel", dto);
//     }

//     photoDtoToPhotoModel(dto: OH.WebSite.Models.DTOs.Response.Get.IPhotoDto[] | OH.WebSite.Models.DTOs.Response.Get.IPhotoDto): IPhotoViewModel | IPhotoViewModel[] {
//         return automapper.map("PhotoDto", "PhotoModel", dto);
//     }

//     userDtoToUserModel(dto: OH.WebSite.Models.DTOs.Response.Get.IUserDto[] | OH.WebSite.Models.DTOs.Response.Get.IUserDto): IUserModel | IUserModel[] {
//         return automapper.map("UserDto", "UserModel", dto);
//     }

//     resolveDate(date: string | Date) {
//         if (!date) return null;
//         return new Date(date as string);
//     }
// }