define('main',["require", "exports", "./environment", "whatwg-fetch", "jquery", "popper.js", "bootstrap", "mdbootstrap", "velocity-animate", "velocity", "custom-scrollbar", "jquery-visible", "ie10-viewport"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .plugin('aurelia-dialog')
            .plugin('aurelia-validation')
            .plugin("aurelia-animator-css")
            .feature('resources')
            .plugin('aurelia-api', function (config) {
            config.registerEndpoint('csz', environment_1.default.apiAddress);
            config.registerEndpoint('viacep', environment_1.default.viacepAddress);
        });
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});



define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true,
        apiAddress: 'http://localhost:49791/api/',
        viacepAddress: 'viacep.com.br/ws/00000000/json/'
    };
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "./services/scriptRunner", "./services/identityService", "aurelia-framework", "aurelia-pal", "aurelia-api", "aurelia-event-aggregator", "./services/notificationService", "jquery", "popper.js", "bootstrap", "mdbootstrap", "velocity-animate", "velocity", "custom-scrollbar", "jquery-visible", "ie10-viewport"], function (require, exports, scriptRunner_1, identityService_1, aurelia_framework_1, aurelia_pal_1, aurelia_api_1, aurelia_event_aggregator_1, notificationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(aurelia, config, ea, service, nService, identityService) {
            this.aurelia = aurelia;
            this.config = config;
            this.ea = ea;
            this.service = service;
            this.nService = nService;
            this.identityService = identityService;
            this.api = this.config.getEndpoint('csz');
            this.identityService.configureHttpClient(this.api.client);
        }
        App.prototype.configureRouter = function (config, router) {
            config = config;
            config.title = 'CSZ Compras Inteligentes';
            this.router = router;
            this.addRoutes(config, router);
        };
        App.prototype.attached = function () {
            scriptRunner_1.ScriptRunner.runScript();
            var other = this;
        };
        App.prototype.addRoutes = function (config, router) {
            config.map([
                { route: '', redirect: 'login' },
                { route: 'login', name: 'login', moduleId: aurelia_pal_1.PLATFORM.moduleName('./views/login') },
                { route: 'invite', name: 'invite', moduleId: aurelia_pal_1.PLATFORM.moduleName('./views/confirmInvite') },
                { route: 'forgotMyPassword', name: 'forgotMyPassword', moduleId: aurelia_pal_1.PLATFORM.moduleName('./views/forgotMyPassword') },
                { route: 'welcome', name: 'invite', moduleId: aurelia_pal_1.PLATFORM.moduleName('./views/welcome') },
                { route: 'csz', name: 'csz', moduleId: aurelia_pal_1.PLATFORM.moduleName('./views/master') },
            ]);
            config.mapUnknownRoutes({ route: 'login' });
            config.fallbackRoute('login');
        };
        App.prototype.logout = function () {
            this.identityService.resetIdentity();
            window.location.assign('/');
        };
        App = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_framework_1.Aurelia,
                aurelia_api_1.Config,
                aurelia_event_aggregator_1.EventAggregator,
                identityService_1.IdentityService,
                notificationService_1.NotificationService,
                identityService_1.IdentityService])
        ], App);
        return App;
    }());
    exports.App = App;
});



define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/evaluationRepository',["require", "exports", "aurelia-api", "aurelia-dependency-injection"], function (require, exports, aurelia_api_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EvaluationRepository = (function () {
        function EvaluationRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        EvaluationRepository.prototype.getEvaluations = function (status) {
            return this.api
                .find('evaluation?status=' + status)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        EvaluationRepository.prototype.getMyEvaluations = function () {
            return this.api
                .find('myEvaluations')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        EvaluationRepository.prototype.finishOrder = function (evaluation) {
            return this.api
                .post('finishOrder', evaluation)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        EvaluationRepository.prototype.updateStatus = function (id, status) {
            return this.api
                .post('evaluation', { id: id, status: status })
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        EvaluationRepository = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], EvaluationRepository);
        return EvaluationRepository;
    }());
    exports.EvaluationRepository = EvaluationRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/stateRegistrationRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StateRegistrationRepository = (function () {
        function StateRegistrationRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        StateRegistrationRepository.prototype.getAll = function () {
            return this.api
                .find('stateRegistration')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        StateRegistrationRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], StateRegistrationRepository);
        return StateRegistrationRepository;
    }());
    exports.StateRegistrationRepository = StateRegistrationRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/userRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserRepository = (function () {
        function UserRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        UserRepository.prototype.getUsersFromFoodService = function (foodServiceId) {
            return this.api
                .find('foodServiceUsers?foodServiceId=' + foodServiceId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        UserRepository.prototype.getUsersFromSupplier = function (supplierId) {
            return this.api
                .find('supplierUsers?supplierId=' + supplierId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        UserRepository.prototype.getUser = function (userId) {
            return this.api
                .find('user?userId=' + userId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        UserRepository.prototype.save = function (user) {
            return this.api
                .post('user', user)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        UserRepository.prototype.confirmInvite = function (invite) {
            return this.api
                .post('confirmInvite', invite)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        UserRepository.prototype.resendInvite = function (userId) {
            return this.api
                .find('resendInvite?userId=' + userId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        UserRepository.prototype.createNew = function (user) {
            return this.api
                .post('welcome', user)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        UserRepository.prototype.resetPassword = function (email) {
            return this.api
                .post('resetPassword', { email: email })
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        UserRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], UserRepository);
        return UserRepository;
    }());
    exports.UserRepository = UserRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/deliveryRuleRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
    var DeliveryRuleRepository = (function () {
        function DeliveryRuleRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        DeliveryRuleRepository.prototype.getRule = function (classId) {
            return this.api
                .find('deliveryRule?productClassId=' + classId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        DeliveryRuleRepository.prototype.save = function (rule) {
            return this.api
                .post('deliveryRule', rule)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        DeliveryRuleRepository.prototype.checkDeliveryRule = function (rule) {
            return this.api
                .post('checkDelivery', rule)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        DeliveryRuleRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], DeliveryRuleRepository);
        return DeliveryRuleRepository;
    }());
    exports.DeliveryRuleRepository = DeliveryRuleRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/foodServiceRepository',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "aurelia-api", "../domain/editFoodServiceStatus"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, aurelia_api_1, editFoodServiceStatus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FoodServiceRepository = (function () {
        function FoodServiceRepository(config, client) {
            this.config = config;
            this.client = client;
            this.api = this.config.getEndpoint('csz');
        }
        FoodServiceRepository.prototype.getByUser = function (userId) {
            return this.api
                .find('foodServiceByUser?userId=' + userId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.get = function (id) {
            return this.api
                .find('foodService?supplierId=' + id)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.getAll = function () {
            return this.api
                .find('allFoodServices')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.save = function (foodService) {
            return this.api
                .post('foodService', foodService)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.getProductsByMarket = function (classId) {
            return this.api
                .find('foodServiceProduct?marketId=' + classId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.getProducts = function () {
            return this.api
                .find('foodServiceProduct')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.getBuyListsParaCotacao = function () {
            return this.api
                .find('cotacao')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.getLists = function () {
            return this.api
                .find('buyList')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.addProduct = function (product) {
            return this.api
                .post('foodServiceProduct', product)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.inativateProduct = function (product) {
            return this.api
                .post('inativateFoodServiceProduct', product)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.addBuyList = function (buyList) {
            if (buyList.productClass.categories != null) {
                buyList.productClass.categories = [];
            }
            return this.api
                .post('buyList', buyList)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.deleteBuyList = function (buyList) {
            return this.api
                .destroy('buyList?id=' + buyList.id)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.alterBuyList = function (viewModel) {
            return this.api
                .post('alterBuyListProduct', viewModel)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.updateStatus = function (foodServiceId, status) {
            var vm = new editFoodServiceStatus_1.EditFoodServiceStatus();
            vm.foodServiceId = foodServiceId;
            vm.status = status;
            return this.api
                .post('foodServiceStatus', vm)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository.prototype.uploadSocialContract = function (file, foodServiceId) {
            var _this = this;
            this.client.configure(function (config) {
                config.withBaseUrl(_this.api.client.baseUrl);
            });
            this.client.defaults.headers = {};
            var headers = new Headers();
            headers.append('Accept', 'application/json');
            return this.client
                .fetch('uploadFoodServiceContractSocial?foodServiceId=' + foodServiceId, {
                method: 'POST',
                body: file,
                headers: headers
            })
                .then(function (response) {
                if (response.status != 200) {
                    throw "Erro";
                }
                return response;
            })
                .then(function (data) {
                return data;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config, aurelia_fetch_client_1.HttpClient])
        ], FoodServiceRepository);
        return FoodServiceRepository;
    }());
    exports.FoodServiceRepository = FoodServiceRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/foodServiceConnectionRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FoodServiceConnectionRepository = (function () {
        function FoodServiceConnectionRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        FoodServiceConnectionRepository.prototype.getSuppliers = function (queryType) {
            return this.api
                .find('foodServiceConnection?queryType=' + queryType)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceConnectionRepository.prototype.updateConnection = function (connection) {
            return this.api
                .post('FoodServiceConnection', connection)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FoodServiceConnectionRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], FoodServiceConnectionRepository);
        return FoodServiceConnectionRepository;
    }());
    exports.FoodServiceConnectionRepository = FoodServiceConnectionRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/supplierRepository',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "aurelia-api", "../services/identityService", "../domain/editSupplierStatus"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, aurelia_api_1, identityService_1, editSupplierStatus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupplierRepository = (function () {
        function SupplierRepository(config, client, service) {
            this.config = config;
            this.client = client;
            this.service = service;
            this.api = this.config.getEndpoint('csz');
        }
        SupplierRepository.prototype.uploadSocialContract = function (file, supplierId) {
            var _this = this;
            this.client.configure(function (config) {
                config.withBaseUrl(_this.api.client.baseUrl);
            });
            this.client.defaults.headers = {};
            var headers = new Headers();
            headers.append('Accept', 'application/json');
            return this.client
                .fetch('uploadSupplierContractSocial?supplierId=' + supplierId, {
                method: 'POST',
                body: file,
                headers: headers
            })
                .then(function (response) {
                if (response.status != 200) {
                    throw "Erro";
                }
                return response;
            })
                .then(function (data) {
                return data;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierRepository.prototype.updateStatus = function (supplierId, status) {
            var vm = new editSupplierStatus_1.EditSupplierStatus();
            vm.supplierId = supplierId;
            vm.status = status;
            return this.api
                .post('supplierStatus', vm)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierRepository.prototype.get = function (id) {
            return this.api
                .find('supplier?supplierId=' + id)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierRepository.prototype.getSupplier = function () {
            return this.api
                .find('supplier')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierRepository.prototype.getAllSuppliers = function () {
            return this.api
                .find('allSuppliers')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierRepository.prototype.save = function (supplier) {
            return this.api
                .post('supplier', supplier)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierRepository.prototype.addProduct = function (product) {
            return this.api
                .post('supplierProduct', product)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config, aurelia_fetch_client_1.HttpClient, identityService_1.IdentityService])
        ], SupplierRepository);
        return SupplierRepository;
    }());
    exports.SupplierRepository = SupplierRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/supplierConnectionRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupplierConnectionRepository = (function () {
        function SupplierConnectionRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        SupplierConnectionRepository.prototype.getSuggestedSuppliers = function () {
            return this.api
                .find('suggestedSupplier')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierConnectionRepository.prototype.connect = function (supplier) {
            return this.api
                .post('supplierConnection', supplier)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierConnectionRepository.prototype.block = function (vm) {
            return this.api
                .post('blockSupplierConnection', vm)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierConnectionRepository.prototype.unblock = function (vm) {
            return this.api
                .post('unblockSupplierConnection', vm)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierConnectionRepository.prototype.getMySuppliers = function () {
            return this.api
                .find('mySuppliers')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierConnectionRepository.prototype.getMyBlockedSuppliers = function () {
            return this.api
                .find('myBlockedSuppliers')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierConnectionRepository.prototype.getAllSuppliers = function () {
            return this.api
                .find('foodServiceSuppliers')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SupplierConnectionRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], SupplierConnectionRepository);
        return SupplierConnectionRepository;
    }());
    exports.SupplierConnectionRepository = SupplierConnectionRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/notificationRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationRepository = (function () {
        function NotificationRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        NotificationRepository.prototype.getAll = function () {
            return this.api
                .find('notification')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        NotificationRepository.prototype.updateUnseen = function (notificationIds) {
            return this.api
                .post('seenNotification', notificationIds)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        NotificationRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], NotificationRepository);
        return NotificationRepository;
    }());
    exports.NotificationRepository = NotificationRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/marketRuleRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MarketRuleRepository = (function () {
        function MarketRuleRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        MarketRuleRepository.prototype.getRule = function (userId) {
            return this.api
                .find('marketRule?userId=' + userId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        MarketRuleRepository.prototype.save = function (rule) {
            return this.api
                .post('MarketRule', rule)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        MarketRuleRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], MarketRuleRepository);
        return MarketRuleRepository;
    }());
    exports.MarketRuleRepository = MarketRuleRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/orderRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OrderRepository = (function () {
        function OrderRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        OrderRepository.prototype.createOrder = function (result) {
            return this.api
                .post('Order', result)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        OrderRepository.prototype.getMyNewOrders = function () {
            return this.api
                .find('MyNewOrders')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        OrderRepository.prototype.getMyAcceptedOrders = function () {
            return this.api
                .find('MyAcceptedOrders')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        OrderRepository.prototype.getMyRejectedOrders = function () {
            return this.api
                .find('MyRejectedOrders')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        OrderRepository.prototype.getMyDeliveredOrders = function () {
            return this.api
                .find('MyDeliveredOrders')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        OrderRepository.prototype.acceptOrder = function (order) {
            return this.api
                .post('acceptOrder', { id: order.id, deliveryDate: order.deliveryDate, paymentDate: order.paymentDate })
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        OrderRepository.prototype.rejectOrder = function (vm) {
            return this.api
                .post('rejectOrder', vm)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        OrderRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], OrderRepository);
        return OrderRepository;
    }());
    exports.OrderRepository = OrderRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/financeRepository',["require", "exports", "aurelia-api", "aurelia-dependency-injection"], function (require, exports, aurelia_api_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FinanceRepository = (function () {
        function FinanceRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        FinanceRepository.prototype.getControls = function () {
            return this.api
                .find('invoiceControl')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FinanceRepository.prototype.generateInvoices = function (selectedControl) {
            return this.api
                .post('invoice', { dateReference: selectedControl.dateReference })
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FinanceRepository.prototype.saveInvoice = function (invoice) {
            debugger;
            return this.api
                .post('editInvoice', invoice)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        FinanceRepository = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], FinanceRepository);
        return FinanceRepository;
    }());
    exports.FinanceRepository = FinanceRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/productRepository',["require", "exports", "../services/identityService", "aurelia-framework", "aurelia-api", "aurelia-fetch-client"], function (require, exports, identityService_1, aurelia_framework_1, aurelia_api_1, aurelia_fetch_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProductRepository = (function () {
        function ProductRepository(config, client, service) {
            this.config = config;
            this.client = client;
            this.service = service;
            this.api = this.config.getEndpoint('csz');
        }
        ProductRepository.prototype.addOrUpdate = function (product) {
            return this.api
                .post('product', product)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.getAllCategories = function () {
            return this.api
                .find('productCategory')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.getAllClasses = function () {
            return this.api
                .find('productClass')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.getClassesByOfferedProducts = function () {
            return this.api
                .find('productClassByOfferedProducts')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.getAllProductsByCategory = function (category) {
            return this.api
                .find('productSearch?categoryId=' + category)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.getAllProducts = function () {
            return this.api
                .find('product')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.getOfferedProducts = function (categoryId) {
            return this.api
                .find('productByCategory?categoryId=' + categoryId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.addSuplierProduct = function (supplierProduct) {
            return this.api
                .post('SupplierProduct', supplierProduct)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.getAllSuplierProducts = function (categoryId) {
            return this.api
                .find('supplierProduct?categoryId=' + categoryId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.alterSuplierProduct = function (supplierProduct) {
            var list = [];
            supplierProduct.forEach(function (x) {
                var viewModel = {
                    id: x.id,
                    status: x.status,
                    price: x.price
                };
                list.push(viewModel);
            });
            return this.api
                .post('AlterSuplierProduct', list)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.uploadFile = function (file) {
            var _this = this;
            this.client.configure(function (config) {
                config.withBaseUrl(_this.api.client.baseUrl);
            });
            this.client.defaults.headers = {};
            var headers = new Headers();
            headers.append('Accept', 'application/json');
            var userId = this.service.getIdentity().id;
            return this.client
                .fetch('uploadSupplierProducts?userId=' + userId, {
                method: 'POST',
                body: file,
                headers: headers
            })
                .then(function (response) {
                if (response.status != 200) {
                    throw "Erro";
                }
                return response.json();
            })
                .then(function (data) {
                return data;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.getAllSuplierProductFiles = function () {
            return this.api
                .find('supplierProductFile')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository.prototype.addOrUpdateClass = function (market) {
            return this.api
                .post('productClass', market)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ProductRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config, aurelia_fetch_client_1.HttpClient, identityService_1.IdentityService])
        ], ProductRepository);
        return ProductRepository;
    }());
    exports.ProductRepository = ProductRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/simulationRepository',["require", "exports", "../services/identityService", "aurelia-framework", "aurelia-api", "aurelia-fetch-client"], function (require, exports, identityService_1, aurelia_framework_1, aurelia_api_1, aurelia_fetch_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimulationRepository = (function () {
        function SimulationRepository(config, client, service) {
            this.config = config;
            this.client = client;
            this.service = service;
            this.api = this.config.getEndpoint('csz');
        }
        SimulationRepository.prototype.timeout = function (ms, promise) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject(new Error("timeout"));
                }, ms);
                promise.then(resolve, reject);
            });
        };
        SimulationRepository.prototype.simulate = function (input) {
            return this.api.post('simulation', input)
                .then(function (result) {
                if (result == null)
                    return Promise.resolve();
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    console.log(error);
                    throw error;
                }));
            });
        };
        SimulationRepository.prototype.getCotacaoFromOrder = function (orderId) {
            return this.api
                .find('cotacaoParcial?orderId=' + orderId)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        SimulationRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config, aurelia_fetch_client_1.HttpClient, identityService_1.IdentityService])
        ], SimulationRepository);
        return SimulationRepository;
    }());
    exports.SimulationRepository = SimulationRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/loginRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoginRepository = (function () {
        function LoginRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        LoginRepository.prototype.login = function (login) {
            return this.api
                .post('login', login)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        LoginRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], LoginRepository);
        return LoginRepository;
    }());
    exports.LoginRepository = LoginRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/priceListRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PriceListRepository = (function () {
        function PriceListRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        PriceListRepository.prototype.getAll = function () {
            return this.api
                .find('priceList')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        PriceListRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], PriceListRepository);
        return PriceListRepository;
    }());
    exports.PriceListRepository = PriceListRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/unitOfMeasurementRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitOfMeasurementRepository = (function () {
        function UnitOfMeasurementRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        UnitOfMeasurementRepository.prototype.getAll = function () {
            return this.api
                .find('unitOfMeasurement')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        UnitOfMeasurementRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], UnitOfMeasurementRepository);
        return UnitOfMeasurementRepository;
    }());
    exports.UnitOfMeasurementRepository = UnitOfMeasurementRepository;
});



define('validators/foodServiceValidator',["require", "exports", "./contactValidator", "./addressValidator"], function (require, exports, contactValidator_1, addressValidator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FoodServiceValidator = (function () {
        function FoodServiceValidator(foodService) {
            this.foodService = foodService;
            this.errorMessages = new Array();
            if (this.foodService != null && this.foodService.address != null) {
                this.addressValidator = new addressValidator_1.AddressValidator(this.foodService.address);
            }
            if (this.foodService != null && this.foodService.contact != null) {
                this.contactValidator = new contactValidator_1.ContactValidator(this.foodService.contact);
            }
            this.validate();
        }
        FoodServiceValidator.prototype.validate = function () {
            var _this = this;
            this.errorMessages = [];
            this.addressValidator
                .validate()
                .forEach(function (x) {
                _this.errorMessages.push(x);
            });
            this.contactValidator
                .validate()
                .forEach(function (x) {
                _this.errorMessages.push(x);
            });
            this.validateName();
            this.validateInscricaoEstadual();
            return this.errorMessages;
        };
        FoodServiceValidator.prototype.validateName = function () {
            if (this.foodService.name == null || this.foodService.name.length == 0) {
                this.errorMessages.push('O nome do fornecedor é obrigatório');
                this.isNameInvalid = true;
            }
            else {
                this.isNameInvalid = false;
            }
        };
        FoodServiceValidator.prototype.validateInscricaoEstadual = function () {
            if (this.foodService.inscricaoEstadual == null || this.foodService.inscricaoEstadual == '') {
                this.errorMessages.push('A inscrição estadual é obrigatória');
                this.isInscricaoEstadualInvalid = true;
            }
            else {
                this.isInscricaoEstadualInvalid = false;
            }
        };
        return FoodServiceValidator;
    }());
    exports.FoodServiceValidator = FoodServiceValidator;
});



define('validators/supplierValidator',["require", "exports", "./contactValidator", "./addressValidator"], function (require, exports, contactValidator_1, addressValidator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupplierValidator = (function () {
        function SupplierValidator(supplier) {
            this.supplier = supplier;
            this.errorMessages = new Array();
            this.addressValidator = new addressValidator_1.AddressValidator(this.supplier.address);
            this.contactValidator = new contactValidator_1.ContactValidator(this.supplier.contact);
            this.validate();
        }
        SupplierValidator.prototype.validate = function () {
            var _this = this;
            this.errorMessages = [];
            this.addressValidator
                .validate()
                .forEach(function (x) {
                _this.errorMessages.push(x);
            });
            this.contactValidator
                .validate()
                .forEach(function (x) {
                _this.errorMessages.push(x);
            });
            this.validateName();
            this.validateInscricaoEstadual();
            return this.errorMessages;
        };
        SupplierValidator.prototype.validateName = function () {
            if (this.supplier.name == null || this.supplier.name.length == 0) {
                this.errorMessages.push('O nome do fornecedor é obrigatório');
                this.isNameInvalid = true;
            }
            else {
                this.isNameInvalid = false;
            }
        };
        SupplierValidator.prototype.validateInscricaoEstadual = function () {
            if (this.supplier.inscricaoEstadual == null || this.supplier.inscricaoEstadual == '') {
                this.errorMessages.push('A inscrição estadual é obrigatória');
                this.isInscricaoEstadualInvalid = true;
            }
            else {
                this.isInscricaoEstadualInvalid = false;
            }
        };
        return SupplierValidator;
    }());
    exports.SupplierValidator = SupplierValidator;
});



define('validators/contactValidator',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContactValidator = (function () {
        function ContactValidator(contact) {
            this.contact = contact;
            this.errorMessages = new Array();
            this.validate();
        }
        ContactValidator.prototype.validate = function () {
            this.errorMessages = [];
            if (this.contact != null) {
                this.validateName();
                this.validatePhone();
                this.validateEmail();
            }
            return this.errorMessages;
        };
        ContactValidator.prototype.validateName = function () {
            if (this.contact.name == null || this.contact.name.length == 0) {
                this.errorMessages.push('O nome do contato é obrigatório');
                this.isNameInvalid = true;
            }
            else {
                this.isNameInvalid = false;
            }
        };
        ContactValidator.prototype.validatePhone = function () {
            if (this.contact.phone == null || ('' + this.contact.phone).length < 10) {
                this.errorMessages.push('O telefone do contato é obrigatório');
                this.isPhoneInvalid = true;
            }
            else {
                this.isPhoneInvalid = false;
            }
        };
        ContactValidator.prototype.validateEmail = function () {
            if (this.contact.email == null || this.contact.email.length <= 10) {
                this.errorMessages.push('O telefone do contato é obrigatório');
                this.isEmailInvalid = true;
            }
            else if (!this.validateEmailString(this.contact.email)) {
                this.errorMessages.push('O e-mail digitado é invalido');
                this.isEmailInvalid = true;
            }
            else {
                this.isEmailInvalid = false;
            }
        };
        ContactValidator.prototype.validateEmailString = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };
        return ContactValidator;
    }());
    exports.ContactValidator = ContactValidator;
});



define('validators/addressValidator',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddressValidator = (function () {
        function AddressValidator(address) {
            this.address = address;
            this.errorMessages = new Array();
            this.validate();
        }
        AddressValidator.prototype.validate = function () {
            this.errorMessages = [];
            if (this.address != null) {
                this.validateCep();
                this.validateLogradouro();
                this.validateNumber();
                this.validateNeighborhood();
                this.validateCity();
                this.validateState();
            }
            return this.errorMessages;
        };
        AddressValidator.prototype.validateCep = function () {
            if (this.address.cep == null || this.address.cep.length < 8) {
                this.errorMessages.push('O cep do endereço é obrigatório');
                this.isCepInvalid = true;
            }
            else {
                this.isCepInvalid = false;
            }
        };
        AddressValidator.prototype.validateLogradouro = function () {
            if (this.address.logradouro == null || this.address.logradouro.length < 3) {
                this.errorMessages.push('O logradouro do endereço é obrigatório');
                this.isLogradouroInvalid = true;
            }
            else {
                this.isLogradouroInvalid = false;
            }
        };
        AddressValidator.prototype.validateNumber = function () {
            if (this.address.number == null || ('' + this.address.number) == '' || this.address.number <= 0) {
                this.errorMessages.push('O número do endereço é obrigatório');
                this.isNumberInvalid = true;
            }
            else {
                this.isNumberInvalid = false;
            }
        };
        AddressValidator.prototype.validateNeighborhood = function () {
            if (this.address.neighborhood == null || this.address.neighborhood.length == 0) {
                this.errorMessages.push('O bairro do endereço é obrigatório');
                this.isNeighborhoodInvalid = true;
            }
            else {
                this.isNeighborhoodInvalid = false;
            }
        };
        AddressValidator.prototype.validateCity = function () {
            if (this.address.city == null || this.address.city.length == 0) {
                this.errorMessages.push('A cidade do endereço é obrigatório');
                this.isCityInvalid = true;
            }
            else {
                this.isCityInvalid = false;
            }
        };
        AddressValidator.prototype.validateState = function () {
            if (this.address.state == null || this.address.state.length == 0) {
                this.errorMessages.push('O estado do endereço é obrigatório');
                this.isStateInvalid = true;
            }
            else {
                this.isStateInvalid = false;
            }
        };
        return AddressValidator;
    }());
    exports.AddressValidator = AddressValidator;
});



define('validators/marketRuleValidator',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MarketRuleValidator = (function () {
        function MarketRuleValidator(rule) {
            this.rule = rule;
            this.errorMessages = new Array();
            this.validate();
        }
        MarketRuleValidator.prototype.validate = function () {
            this.errorMessages = [];
            this.validateMinimumOrderValue();
            this.validateNumberOfDaysToAccept();
            this.validatePeriodToAcceptOrder1();
            this.validatePeriodToAcceptOrder2();
            this.validateDeliverySchedule1();
            this.validateDeliverySchedule2();
            this.validateReceiverNewClient();
            this.validateReceiverNewOrder();
            return this.errorMessages;
        };
        MarketRuleValidator.prototype.validateReceiverNewClient = function () {
            if (this.rule.sendNotificationToNewClient && (this.rule.receiverNewClient == null || this.rule.receiverNewClient == '')) {
                this.errorMessages.push('O e-mail do destinatário em caso de novo cliente está em branco');
                this.isReceiverNewClientInvalid = true;
            }
        };
        MarketRuleValidator.prototype.validateReceiverNewOrder = function () {
            if (this.rule.sendNotificationToNewOrder && (this.rule.receiverNewOrder == null || this.rule.receiverNewOrder == '')) {
                this.errorMessages.push('O e-mail do destinatário em caso de novo pedido está em branco');
                this.isReceiverNewClientInvalid = true;
            }
        };
        MarketRuleValidator.prototype.validateMinimumOrderValue = function () {
            if (this.rule.minimumOrderValue == null || ('' + this.rule.minimumOrderValue) == "") {
                this.errorMessages.push('O valor mínimo do pedido é obrigatório');
                this.isMinimumOrderValueInvalid = true;
            }
            else if (this.rule.minimumOrderValue <= 0) {
                this.errorMessages.push('O valor mínimo do pedido deve ser maior que zero');
                this.isMinimumOrderValueInvalid = true;
            }
            else {
                this.isMinimumOrderValueInvalid = false;
            }
        };
        MarketRuleValidator.prototype.validateNumberOfDaysToAccept = function () {
            if (this.rule.numberOfDaysToAccept == null || ('' + this.rule.numberOfDaysToAccept) == "") {
                this.errorMessages.push('A quantidade de dias para aceite do pedido é obrigatória');
                this.isnumberOfDaysToAcceptInvalid = true;
            }
            else if (this.rule.numberOfDaysToAccept <= 0) {
                this.errorMessages.push('A quantidade de dias para aceite do pedido deve ser maior que zero');
                this.isnumberOfDaysToAcceptInvalid = true;
            }
            else {
                this.isnumberOfDaysToAcceptInvalid = false;
            }
        };
        MarketRuleValidator.prototype.validatePeriodToAcceptOrder1 = function () {
            if (this.rule.periodToAcceptOrder1 == null || ('' + this.rule.periodToAcceptOrder1) == '') {
                this.errorMessages.push('O período inicial de aceite é obrigatório');
                this.isPeriodToAcceptOrder1Invalid = true;
            }
            else if (this.rule.periodToAcceptOrder1 > 1800) {
                this.errorMessages.push('O período inicial de aceite é inválido');
                this.isPeriodToAcceptOrder1Invalid = true;
            }
            else {
                this.isPeriodToAcceptOrder1Invalid = false;
            }
        };
        MarketRuleValidator.prototype.validatePeriodToAcceptOrder2 = function () {
            if (this.rule.periodToAcceptOrder2 == null || ('' + this.rule.periodToAcceptOrder2) == '') {
                this.errorMessages.push('O período final de aceite é obrigatório');
                this.isPeriodToAcceptOrder2Invalid = true;
            }
            else if (this.rule.periodToAcceptOrder2 > 2400) {
                this.errorMessages.push('O período final  de aceite é inválido');
                this.isPeriodToAcceptOrder2Invalid = true;
            }
            else {
                this.isPeriodToAcceptOrder2Invalid = false;
            }
        };
        MarketRuleValidator.prototype.validateDeliverySchedule1 = function () {
            if (this.rule.deliverySchedule1 == null || ('' + this.rule.deliverySchedule1) == '') {
                this.errorMessages.push('O horário inicial de entrega é obrigatório');
                this.isDeliverySchedule1Invalid = true;
            }
            else if (this.rule.deliverySchedule1 > 1800) {
                this.errorMessages.push('O horário inicial de entrega é inválido');
                this.isDeliverySchedule1Invalid = true;
            }
            else {
                this.isDeliverySchedule1Invalid = false;
            }
        };
        MarketRuleValidator.prototype.validateDeliverySchedule2 = function () {
            if (this.rule.deliverySchedule2 == null || ('' + this.rule.deliverySchedule2) == '') {
                this.errorMessages.push('O horário final de entrega é obrigatório');
                this.isDeliverySchedule2Invalid = true;
            }
            else if (this.rule.deliverySchedule1 > 2400) {
                this.errorMessages.push('O horário final de entrega é inválido');
                this.isDeliverySchedule2Invalid = true;
            }
            else {
                this.isDeliverySchedule2Invalid = false;
            }
        };
        return MarketRuleValidator;
    }());
    exports.MarketRuleValidator = MarketRuleValidator;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/forgotMyPassword',["require", "exports", "../services/notificationService", "../services/scriptRunner", "../services/identityService", "../repositories/loginRepository", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../repositories/userRepository", "jquery", "popper.js", "bootstrap", "mdbootstrap", "velocity-animate", "velocity", "custom-scrollbar", "jquery-visible", "ie10-viewport"], function (require, exports, notificationService_1, scriptRunner_1, identityService_1, loginRepository_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, userRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ForgotMyPassword = (function () {
        function ForgotMyPassword(router, aurelia, loginRepository, userRepository, service, ea, nService) {
            this.router = router;
            this.aurelia = aurelia;
            this.loginRepository = loginRepository;
            this.userRepository = userRepository;
            this.service = service;
            this.ea = ea;
            this.nService = nService;
            this.isLoading = false;
            this.wasReseted = false;
        }
        ForgotMyPassword.prototype.activate = function (params) {
        };
        ForgotMyPassword.prototype.attached = function () {
            if (identityService_1.IdentityService.identity) {
                this.router.navigateToRoute('login');
            }
            else {
                window.setTimeout(function () { return scriptRunner_1.ScriptRunner.runScript(); }, 10);
            }
        };
        ForgotMyPassword.prototype.resetPassword = function () {
            var _this = this;
            if (this.email == null || this.email == '') {
                this.nService.presentError('O e-mail é obrigatório');
            }
            else {
                this.isLoading = true;
                this.userRepository
                    .resetPassword(this.email)
                    .then(function () {
                    _this.isLoading = false;
                    _this.wasReseted = true;
                }).catch(function (e) {
                    _this.nService.error(e);
                    _this.isLoading = false;
                    _this.wasReseted = false;
                });
            }
        };
        ForgotMyPassword = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_framework_1.Aurelia,
                loginRepository_1.LoginRepository,
                userRepository_1.UserRepository,
                identityService_1.IdentityService,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService])
        ], ForgotMyPassword);
        return ForgotMyPassword;
    }());
    exports.ForgotMyPassword = ForgotMyPassword;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/confirmInvite',["require", "exports", "../services/notificationService", "../services/scriptRunner", "../services/identityService", "../repositories/loginRepository", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../repositories/userRepository", "../domain/userStatus", "../domain/confirmInviteViewModel", "jquery", "popper.js", "bootstrap", "mdbootstrap", "velocity-animate", "velocity", "custom-scrollbar", "jquery-visible", "ie10-viewport"], function (require, exports, notificationService_1, scriptRunner_1, identityService_1, loginRepository_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, userRepository_1, userStatus_1, confirmInviteViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Login = (function () {
        function Login(router, aurelia, loginRepository, userRepository, service, ea, nService) {
            this.router = router;
            this.aurelia = aurelia;
            this.loginRepository = loginRepository;
            this.userRepository = userRepository;
            this.service = service;
            this.ea = ea;
            this.nService = nService;
            this.processing = false;
            this.isLoading = true;
            this.invite = new confirmInviteViewModel_1.ConfirmInviteViewModel();
        }
        Login.prototype.activate = function (params) {
            if (params != null && params.userId) {
                this.userId = params.userId;
            }
            else {
                this.router.navigateToRoute('login');
            }
        };
        Login.prototype.attached = function () {
            if (identityService_1.IdentityService.identity) {
                this.router.navigateToRoute('login');
            }
            else {
                this.loadData();
            }
        };
        Login.prototype.loadData = function () {
            var _this = this;
            this.userRepository
                .getUser(this.userId)
                .then(function (user) {
                if (user.status == userStatus_1.UserStatus.WaitingToConfirmInvite || user.status == userStatus_1.UserStatus.WaitingToConfirmPassword) {
                    _this.user = user;
                    _this.isLoading = false;
                    scriptRunner_1.ScriptRunner.runScript();
                }
                else {
                    _this.router.navigateToRoute('login');
                }
            })
                .catch(function (e) {
                _this.nService.error(e);
                _this.processing = false;
            });
        };
        Login.prototype.save = function () {
            var _this = this;
            this.invite.userId = this.userId;
            if (this.invite.password != this.invite.confirmPassword) {
                this.nService.presentError('A senha e a confirmação de senha são diferentes');
            }
            else {
                this.processing = true;
                this.userRepository
                    .confirmInvite(this.invite)
                    .then(function (identity) {
                    _this.processing = false;
                    _this.router.navigateToRoute('login');
                }).catch(function (e) {
                    _this.nService.error(e);
                    _this.processing = false;
                });
            }
        };
        Login = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_framework_1.Aurelia,
                loginRepository_1.LoginRepository,
                userRepository_1.UserRepository,
                identityService_1.IdentityService,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService])
        ], Login);
        return Login;
    }());
    exports.Login = Login;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/welcome',["require", "exports", "aurelia-router", "aurelia-event-aggregator", "aurelia-dependency-injection", "../services/identityService", "../services/scriptRunner", "../services/notificationService", "aurelia-framework", "../repositories/loginRepository", "../repositories/userRepository", "aurelia-validation", "../domain/welcomeUser", "./formValidationRenderer", "jquery-visible", "popper.js", "bootstrap", "velocity-animate"], function (require, exports, aurelia_router_1, aurelia_event_aggregator_1, aurelia_dependency_injection_1, identityService_1, scriptRunner_1, notificationService_1, aurelia_framework_1, loginRepository_1, userRepository_1, aurelia_validation_1, welcomeUser_1, formValidationRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Welcome = (function () {
        function Welcome(router, aurelia, validationControllerFactory, loginRepository, userRepository, notification, service, ea, nService) {
            this.router = router;
            this.aurelia = aurelia;
            this.validationControllerFactory = validationControllerFactory;
            this.loginRepository = loginRepository;
            this.userRepository = userRepository;
            this.notification = notification;
            this.service = service;
            this.ea = ea;
            this.nService = nService;
            this.user = new welcomeUser_1.WelcomeUser();
            this.user.selectedType = "0";
            this.wasCreated = false;
            this.isLoading = false;
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new formValidationRenderer_1.FormValidationRenderer());
            this.validationController.validateTrigger = aurelia_validation_1.validateTrigger.blur;
            this.validationController.addObject(this.user);
        }
        Welcome.prototype.attached = function () {
            window.setTimeout(function () { return scriptRunner_1.ScriptRunner.runScript(); }, 10);
        };
        Welcome.prototype.activate = function (params) {
            aurelia_validation_1.ValidationRules
                .ensure(function (user) { return user.contactName; }).displayName('Nome').required()
                .ensure(function (user) { return user.email; }).displayName('E-mail').required()
                .ensure(function (user) { return user.commercialPhone; }).displayName('Telefone').required()
                .ensure(function (user) { return user.companyName; }).displayName('Razão Social').required()
                .ensure(function (user) { return user.selectedType; }).displayName('Tipo').required()
                .on(this.user);
        };
        Welcome.prototype.save = function () {
            var _this = this;
            this.validationController
                .validate()
                .then(function (result) {
                if (result.valid) {
                    _this.isLoading = true;
                    _this.userRepository
                        .createNew(_this.user)
                        .then(function () {
                        _this.notification.success('Cadastro realizado com sucesso!');
                        _this.wasCreated = true;
                    })
                        .catch(function (e) {
                        _this.isLoading = false;
                        _this.notification.presentError(e);
                    });
                }
                else {
                    _this.isLoading = false;
                    _this.notification.error('Erros de validação foram encontrados');
                }
            });
        };
        Welcome = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_framework_1.Aurelia,
                aurelia_validation_1.ValidationControllerFactory,
                loginRepository_1.LoginRepository,
                userRepository_1.UserRepository,
                notificationService_1.NotificationService,
                identityService_1.IdentityService,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService])
        ], Welcome);
        return Welcome;
    }());
    exports.Welcome = Welcome;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/login',["require", "exports", "../services/notificationService", "../services/scriptRunner", "../services/identityService", "../repositories/loginRepository", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "jquery", "popper.js", "bootstrap", "mdbootstrap", "velocity-animate", "velocity", "custom-scrollbar", "jquery-visible", "ie10-viewport"], function (require, exports, notificationService_1, scriptRunner_1, identityService_1, loginRepository_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Login = (function () {
        function Login(router, aurelia, loginRepository, service, ea, nService) {
            this.router = router;
            this.aurelia = aurelia;
            this.loginRepository = loginRepository;
            this.service = service;
            this.ea = ea;
            this.nService = nService;
            this.processing = false;
        }
        Login.prototype.doLogin = function () {
            var _this = this;
            this.processing = true;
            this.loginRepository
                .login(this.credential)
                .then(function (identity) {
                _this.service.setIdentity(identity);
                _this.ea.publish('loginDone');
                _this.router.navigateToRoute('csz');
            }).catch(function (e) {
                _this.nService.error(e);
                _this.processing = false;
            });
        };
        Login.prototype.attached = function () {
            scriptRunner_1.ScriptRunner.runScript();
            if (identityService_1.IdentityService.identity) {
                this.ea.publish('loginDone');
                this.router.navigateToRoute('csz');
            }
        };
        Login = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_framework_1.Aurelia,
                loginRepository_1.LoginRepository,
                identityService_1.IdentityService,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService])
        ], Login);
        return Login;
    }());
    exports.Login = Login;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/master',["require", "exports", "aurelia-pal", "aurelia-event-aggregator", "aurelia-dependency-injection", "../services/identityService", "../services/scriptRunner", "../domain/userType", "../repositories/foodServiceConnectionRepository", "../services/notificationService", "../repositories/notificationRepository", "../repositories/orderRepository", "../services/messageService", "jquery-visible", "popper.js", "bootstrap", "velocity-animate"], function (require, exports, aurelia_pal_1, aurelia_event_aggregator_1, aurelia_dependency_injection_1, identityService_1, scriptRunner_1, userType_1, foodServiceConnectionRepository_1, notificationService_1, notificationRepository_1, orderRepository_1, messageService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Master = (function () {
        function Master(service, nService, notificationRepository, identityService, orderRepo, messageService, connRepository, ea) {
            var _this = this;
            this.service = service;
            this.nService = nService;
            this.notificationRepository = notificationRepository;
            this.identityService = identityService;
            this.orderRepo = orderRepo;
            this.messageService = messageService;
            this.connRepository = connRepository;
            this.ea = ea;
            this.isLoadingOrders = true;
            this.isloadingFoodServices = true;
            this.ea.subscribe('loadingData', function () {
                _this.isLoading = true;
            });
            this.ea.subscribe('dataLoaded', function () {
                window.setTimeout(function () { return _this.isLoading = false; }, 500);
            });
        }
        Master.prototype.attached = function () {
            scriptRunner_1.ScriptRunner.runScript();
            this.isLogged = this.service.isLogged();
            this.identity = this.service.getIdentity();
            this.load();
        };
        Master.prototype.load = function () {
            var _this = this;
            this.notifications = [];
            this.unSeenCount = 0;
            this.isLogged = this.service.isLogged();
            this.ea.subscribe('loginDone', function () {
                _this.isLogged = _this.service.isLogged();
                _this.identity = _this.service.getIdentity();
                scriptRunner_1.ScriptRunner.runScript();
            });
            this.ea.subscribe('loadingData', function () {
                _this.isLoading = true;
            });
            this.ea.subscribe('dataLoaded', function () {
                window.setTimeout(function () { return _this.isLoading = false; }, 500);
            });
            if (this.isLogged) {
                this.identity = this.service.getIdentity();
            }
            if (this.isLogged) {
                this.getNotifications();
                this.ea.subscribe('newOrder', function () {
                    _this.newOrdersCount++;
                });
                this.ea.subscribe('orderAccepted', function () {
                    _this.newOrdersCount--;
                    _this.acceptedOrdersCount++;
                });
                this.ea.subscribe('orderRejected', function () {
                    _this.newOrdersCount--;
                    _this.rejectedOrdersCount++;
                });
                this.ea.subscribe('orderFinished', function () {
                    _this.acceptedOrdersCount--;
                });
                this.ea.subscribe('newNotification', function (x) {
                    _this.notifications.unshift(x);
                    _this.updateUnSeenCount();
                    _this.ea.publish(x.eventName, x.body);
                    if (_this.identity.type == userType_1.UserType.Supplier) {
                        _this.loadFoodServiceConnections();
                    }
                });
                if (this.identity.type != userType_1.UserType.Admin) {
                    this.getOrders();
                }
                if (this.identity.type == userType_1.UserType.FoodService) {
                    this.ea.subscribe('registrationSent', function () { return _this.loadFoodServiceConnections(); });
                }
                if (this.identity.type == userType_1.UserType.Supplier) {
                    this.loadFoodServiceConnections();
                    this.ea.subscribe('registrationSent', function () { return _this.loadFoodServiceConnections(); });
                    this.ea.subscribe('foodApproved', function () { return _this.loadFoodServiceConnections(); });
                    this.ea.subscribe('registrationRejected', function () { return _this.loadFoodServiceConnections(); });
                }
            }
            if (this.identity.type == userType_1.UserType.Admin) {
                this.router.navigateToRoute('dashboardAdmin');
            }
            else if (this.identity.type == userType_1.UserType.Supplier) {
                this.router.navigateToRoute('dashboardFornecedor');
                this.ea.subscribe('registrationRejected', function () { return _this.loadFoodServiceConnections(); });
            }
            else if (this.identity.type == userType_1.UserType.FoodService) {
                this.router.navigateToRoute('dashboardFoodService');
            }
        };
        Master.prototype.loadFoodServiceConnections = function () {
            var _this = this;
            var p1 = this.connRepository
                .getSuppliers(0)
                .then(function (data) {
                _this.novoFoodServices = data;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            var p2 = this.connRepository
                .getSuppliers(1)
                .then(function (data) {
                _this.waitingFoodServices = data;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            Promise.all([p1, p2]).then(function () { return _this.isloadingFoodServices = false; });
        };
        Master.prototype.getNotifications = function () {
            var _this = this;
            this.notificationRepository
                .getAll()
                .then(function (notifications) {
                _this.notifications = notifications;
                _this.messageService.subscribe();
                _this.updateUnSeenCount();
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        Master.prototype.getOrders = function () {
            var _this = this;
            var p1 = this.orderRepo
                .getMyNewOrders()
                .then(function (orders) {
                _this.newOrdersCount = orders.length;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            var p2 = this.orderRepo
                .getMyAcceptedOrders()
                .then(function (orders) {
                _this.acceptedOrdersCount = orders.length;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            var p3 = this.orderRepo
                .getMyRejectedOrders()
                .then(function (orders) {
                _this.rejectedOrdersCount = orders.length;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            Promise.all([p1, p2, p3]).then(function () { return _this.isLoadingOrders = false; });
        };
        Master.prototype.updateUnSeenCount = function () {
            if (this.notifications != null) {
                this.unSeenCount = this.notifications.filter(function (notification) { return notification.wasSeen ? false : true; }).length;
            }
        };
        Master.prototype.canActivate = function (params, routeConfig, navigationInstruction) {
            return this.service.isLogged();
        };
        Master.prototype.configureRouter = function (config, router) {
            config.title = '';
            this.router = router;
            this.addRoutes(config, router);
        };
        Master.prototype.updateNotifications = function () {
            var _this = this;
            if (this.unSeenCount > 0) {
                var notificationIds = new Array();
                var unSeenList = this.notifications.filter(function (x) { return !x.wasSeen; });
                unSeenList.forEach(function (x) {
                    notificationIds.push(x.id);
                });
                this.notificationRepository
                    .updateUnseen(notificationIds)
                    .then(function () {
                    _this.unSeenCount = 0;
                    unSeenList.forEach(function (x) {
                        x.wasSeen = true;
                    });
                }).catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
        };
        Master.prototype.addRoutes = function (config, router) {
            this.identity = this.service.getIdentity();
            if (this.identity == null || this.identity.type == userType_1.UserType.Admin) {
                config.map([
                    { route: '', redirect: 'dashboardAdmin' },
                    { route: 'dashboard', name: 'dashboard', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/dashboard') }
                ]);
            }
            else if (this.identity.type == userType_1.UserType.Supplier) {
                config.map([
                    { route: '', redirect: 'dashboard' },
                    { route: 'dashboard', name: 'dashboard', moduleId: aurelia_pal_1.PLATFORM.moduleName('./fornecedor/dashboard') }
                ]);
            }
            else if (this.identity.type == userType_1.UserType.FoodService) {
                config.map([
                    { route: '', redirect: 'dashboard' },
                    { route: 'dashboard', name: 'dashboard', moduleId: aurelia_pal_1.PLATFORM.moduleName('./foodService/dashboard') }
                ]);
            }
            config.map([
                { route: 'login', name: 'login', moduleId: aurelia_pal_1.PLATFORM.moduleName('./login') },
                { route: 'dashboardAdmin', name: 'dashboardAdmin', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/dashboard') },
                { route: 'dashboardFornecedor', name: 'dashboardFornecedor', moduleId: aurelia_pal_1.PLATFORM.moduleName('./fornecedor/dashboard') },
                { route: 'cadastro', name: 'cadastro', moduleId: aurelia_pal_1.PLATFORM.moduleName('./cadastro') },
                { route: 'produtos', name: 'produtos', moduleId: aurelia_pal_1.PLATFORM.moduleName('./fornecedor/produtos') },
                { route: 'regrasDeMercado', name: 'regrasDeMercado', moduleId: aurelia_pal_1.PLATFORM.moduleName('./fornecedor/regrasDeMercado') },
                { route: 'dashboardFoodService', name: 'dashboardFoodService', moduleId: aurelia_pal_1.PLATFORM.moduleName('./foodService/dashboard') },
                { route: 'cadastroFoodService', name: 'cadastroFoodService', moduleId: aurelia_pal_1.PLATFORM.moduleName('./foodService/cadastro') },
                { route: 'regraDeEntrega', name: 'regraDeEntrega', moduleId: aurelia_pal_1.PLATFORM.moduleName('./foodService/regraDeEntrega') },
                { route: 'fornecedores', name: 'fornecedores', moduleId: aurelia_pal_1.PLATFORM.moduleName('./foodService/fornecedores') },
                { route: 'meusProdutos', name: 'meusProdutos', moduleId: aurelia_pal_1.PLATFORM.moduleName('./foodService/meusProdutos') },
                { route: 'clientes', name: 'clientes', moduleId: aurelia_pal_1.PLATFORM.moduleName('./fornecedor/clientes') },
                { route: 'cotacao', name: 'cotacao', moduleId: aurelia_pal_1.PLATFORM.moduleName('./cotacao/cotacao') },
                { route: 'pedidosFornecedor', name: 'pedidosFornecedor', moduleId: aurelia_pal_1.PLATFORM.moduleName('./cotacao/pedidosFornecedor') },
                { route: 'pedidosFoodService', name: 'pedidosFoodService', moduleId: aurelia_pal_1.PLATFORM.moduleName('./foodService/pedidosFoodService') },
                { route: 'mercadosAdmin', name: 'mercadosAdmin', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/product/listMarkets') },
                { route: 'produtosAdmin', name: 'produtosAdmin', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/product/listProduct') },
                { route: 'suppliersAdmin', name: 'suppliersAdmin', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/supplier/listSuppliers') },
                { route: 'foodServicesAdmin', name: 'foodServicesAdmin', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/foodService/listFoodServices') },
                { route: 'editSupplierAdmin', name: 'editSupplierAdmin', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/supplier/editSupplier') },
                { route: 'editFoodServiceAdmin', name: 'editFoodServiceAdmin', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/foodService/editFoodService') },
                { route: 'avaliacoes', name: 'avaliacoes', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/supplier/evaluations') },
                { route: 'avaliacoesFornecedor', name: 'avaliacoesFornecedor', moduleId: aurelia_pal_1.PLATFORM.moduleName('./fornecedor/evaluations') },
                { route: 'avaliacoesFoodService', name: 'avaliacoesFoodService', moduleId: aurelia_pal_1.PLATFORM.moduleName('./foodService/evaluations') },
                { route: 'financeiro', name: 'financeiro', moduleId: aurelia_pal_1.PLATFORM.moduleName('./admin/finance/listInvoice') }
            ]);
            config.mapUnknownRoutes({ route: null, redirect: '/' });
        };
        Master.prototype.logout = function () {
            this.identityService.resetIdentity();
            window.location.assign('/');
        };
        Master = __decorate([
            aurelia_dependency_injection_1.autoinject,
            __metadata("design:paramtypes", [identityService_1.IdentityService,
                notificationService_1.NotificationService,
                notificationRepository_1.NotificationRepository,
                identityService_1.IdentityService,
                orderRepository_1.OrderRepository,
                messageService_1.MessageService,
                foodServiceConnectionRepository_1.FoodServiceConnectionRepository,
                aurelia_event_aggregator_1.EventAggregator])
        ], Master);
        return Master;
    }());
    exports.Master = Master;
});



define('views/formValidationRenderer',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormValidationRenderer = (function () {
        function FormValidationRenderer() {
        }
        FormValidationRenderer.prototype.render = function (instruction) {
            var _loop_1 = function (result, elements) {
                if (result.valid || instruction.render.find(function (x) { return x.result.valid === false && x.result.propertyName === result.propertyName; })) {
                    return "continue";
                }
                for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
                    var element = elements_2[_i];
                    this_1.remove(element, result);
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
                var _b = _a[_i], result = _b.result, elements = _b.elements;
                _loop_1(result, elements);
            }
            for (var _c = 0, _d = instruction.render; _c < _d.length; _c++) {
                var _e = _d[_c], result = _e.result, elements = _e.elements;
                if (result.valid) {
                    continue;
                }
                for (var _f = 0, elements_1 = elements; _f < elements_1.length; _f++) {
                    var element = elements_1[_f];
                    this.add(element, result);
                }
            }
        };
        FormValidationRenderer.prototype.add = function (element, result) {
            var formGroup = element.closest('.form-group');
            if (!formGroup || formGroup.classList.contains('has-danger')) {
                return;
            }
            formGroup.classList.add('has-danger');
            formGroup.firstElementChild.classList.add('text-danger');
            element.classList.add('border-danger');
            this.setAttributes(element, {
                "data-toggle": "popover",
                "data-content": result.message,
                "data-placement": "top",
                "data-trigger": "hover"
            });
            $(element).popover();
        };
        FormValidationRenderer.prototype.remove = function (element, result) {
            var formGroup = element.closest('.form-group');
            if (!formGroup) {
                return;
            }
            formGroup.classList.remove('has-danger');
            formGroup.firstElementChild.classList.remove('text-danger');
            element.classList.remove('border-danger');
            this.removeAttributes(element, {
                "data-toggle": "popover",
                "data-placement": "top",
                "data-content": result.message,
                "data-trigger": "hover"
            });
            $(element).popover('dispose');
        };
        FormValidationRenderer.prototype.setAttributes = function (element, attrs) {
            for (var key in attrs) {
                element.setAttribute(key, attrs[key]);
            }
        };
        FormValidationRenderer.prototype.removeAttributes = function (element, attrs) {
            for (var key in attrs) {
                element.removeAttribute(key, attrs[key]);
            }
        };
        return FormValidationRenderer;
    }());
    exports.FormValidationRenderer = FormValidationRenderer;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/cadastro',["require", "exports", "../validators/supplierValidator", "../services/consultaCEPService", "../repositories/stateRegistrationRepository", "../domain/stateRegistration", "../services/notificationService", "../services/identityService", "../repositories/supplierRepository", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../domain/address", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, supplierValidator_1, consultaCEPService_1, stateRegistrationRepository_1, stateRegistration_1, notificationService_1, identityService_1, supplierRepository_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, address_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cadastro = (function () {
        function Cadastro(router, repository, ea, service, nService, stateRepo, consultaCepService) {
            this.router = router;
            this.repository = repository;
            this.ea = ea;
            this.service = service;
            this.nService = nService;
            this.stateRepo = stateRepo;
            this.consultaCepService = consultaCepService;
            this.currentStep = 1;
            this.totalSteps = 3;
            this.isLoading = false;
        }
        Cadastro.prototype.runScript = function () {
            var thisForm = '#rootwizard-1';
            var outher = this;
            if ($(thisForm).length) {
                $('.pager li a, .pager li span').on('click', function (e) {
                    e.preventDefault();
                });
                var wizardStagesTotal = $(thisForm + ' .tab-pane').length;
                $(thisForm).bootstrapWizard({ onNext: function (tab, navigation, index) {
                        if (index <= wizardStagesTotal) {
                            $(thisForm + ' .tab-pane').eq(index).addClass('active');
                            $(thisForm + ' .tab-pane').eq(index - 1).removeClass('active');
                        }
                    }, onPrevious: function (tab, navigation, index) {
                        if (index !== -1) {
                            $(thisForm + ' .tab-pane').eq(index).addClass('active');
                            $(thisForm + ' .tab-pane').eq(index + 1).removeClass('active');
                        }
                    }, onTabShow: function (tab, navigation, index) {
                        var total = navigation.find('li').length;
                        var current = index + 1;
                        var completionPercentage = (current / total) * 100;
                        var progressBar = $(thisForm).closest('.card').find(".card-header .progress-bar");
                        progressBar.css({ "width": completionPercentage + "%" }).attr("aria-valuenow", completionPercentage);
                    }, onTabClick: function (tab, navigation, index) {
                        return false;
                    } });
            }
        };
        Cadastro.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.runScript();
            this.loadData();
        };
        Cadastro.prototype.loadData = function () {
            var _this = this;
            var identity = this.service.getIdentity();
            var promisse1 = this.repository
                .getSupplier()
                .then(function (supplier) {
                _this.supplier = supplier;
                if (_this.supplier.address == null) {
                    _this.supplier.address = new address_1.Address();
                }
                if (_this.supplier.stateRegistration == null) {
                    _this.supplier.stateRegistration = new stateRegistration_1.StateRegistration();
                }
                _this.validator = new supplierValidator_1.SupplierValidator(_this.supplier);
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            var promisse2 = this.stateRepo
                .getAll()
                .then(function (data) {
                _this.stateRegistrations = data;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            Promise.all([promisse1, promisse2]).then(function () { return _this.ea.publish('dataLoaded'); });
        };
        Cadastro.prototype.consultaCEP = function () {
            var _this = this;
            this.validator.addressValidator.validateCep();
            if (this.supplier.address.cep.length >= 8) {
                this.consultaCepService
                    .findCEP(this.supplier.address.cep)
                    .then(function (result) {
                    if (result != null) {
                        _this.supplier.address.city = result.localidade;
                        _this.supplier.address.neighborhood = result.bairro;
                        _this.supplier.address.number = null;
                        _this.supplier.address.logradouro = result.logradouro;
                        _this.supplier.address.complement = result.complemento;
                        _this.supplier.address.state = result.uf;
                        _this.validator.validate();
                    }
                }).catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
        };
        Cadastro.prototype.advance = function () {
            this.currentStep++;
        };
        Cadastro.prototype.back = function () {
            this.currentStep--;
        };
        Cadastro.prototype.save = function () {
            var _this = this;
            this.isLoading = true;
            var errors = this.validator.validate();
            if (errors.length == 0) {
                this.supplier.stateRegistration = this.stateRegistrations.filter(function (x) { return x.id == _this.supplier.stateRegistration.id; })[0];
                this.repository
                    .save(this.supplier)
                    .then(function (identity) {
                    _this.nService.success('Cadastro realizado!');
                    _this.router.navigate('/#/cadastro');
                    _this.isLoading = false;
                }).catch(function (e) {
                    _this.nService.error(e);
                    _this.isLoading = false;
                });
            }
            else {
                this.isLoading = false;
                errors.forEach(function (error) {
                    _this.nService.error(error);
                });
            }
        };
        Cadastro = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                supplierRepository_1.SupplierRepository,
                aurelia_event_aggregator_1.EventAggregator,
                identityService_1.IdentityService,
                notificationService_1.NotificationService,
                stateRegistrationRepository_1.StateRegistrationRepository,
                consultaCEPService_1.ConsultaCEPService])
        ], Cadastro);
        return Cadastro;
    }());
    exports.Cadastro = Cadastro;
});



define('domain/invoice',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Invoice = (function () {
        function Invoice() {
        }
        return Invoice;
    }());
    exports.Invoice = Invoice;
});



define('domain/confirmScheduleOrderViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfirmScheduleOrderViewModel = (function () {
        function ConfirmScheduleOrderViewModel() {
        }
        return ConfirmScheduleOrderViewModel;
    }());
    exports.ConfirmScheduleOrderViewModel = ConfirmScheduleOrderViewModel;
});



define('domain/foodServiceProduct',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FoodServiceProduct = (function () {
        function FoodServiceProduct() {
        }
        return FoodServiceProduct;
    }());
    exports.FoodServiceProduct = FoodServiceProduct;
});



define('domain/productClass',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProductClass = (function () {
        function ProductClass() {
        }
        return ProductClass;
    }());
    exports.ProductClass = ProductClass;
});



define('domain/buyListProduct',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuyListProduct = (function () {
        function BuyListProduct() {
        }
        return BuyListProduct;
    }());
    exports.BuyListProduct = BuyListProduct;
});



define('domain/state',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var State = (function () {
        function State() {
        }
        return State;
    }());
    exports.State = State;
});



define('domain/contact',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Contact = (function () {
        function Contact() {
        }
        return Contact;
    }());
    exports.Contact = Contact;
});



define('domain/credential',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Credential = (function () {
        function Credential() {
        }
        return Credential;
    }());
    exports.Credential = Credential;
});



define('domain/stateRegistration',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StateRegistration = (function () {
        function StateRegistration() {
        }
        return StateRegistration;
    }());
    exports.StateRegistration = StateRegistration;
});



define('domain/identity',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Identity = (function () {
        function Identity() {
        }
        return Identity;
    }());
    exports.Identity = Identity;
});



define('domain/brand',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Brand = (function () {
        function Brand() {
        }
        return Brand;
    }());
    exports.Brand = Brand;
});



define('domain/invoiceStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InvoiceStatus;
    (function (InvoiceStatus) {
        InvoiceStatus[InvoiceStatus["Created"] = 0] = "Created";
        InvoiceStatus[InvoiceStatus["Paid"] = 1] = "Paid";
        InvoiceStatus[InvoiceStatus["NotPaid"] = 2] = "NotPaid";
    })(InvoiceStatus = exports.InvoiceStatus || (exports.InvoiceStatus = {}));
});



define('domain/supplierProductFileRow',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupplierProductFileRow = (function () {
        function SupplierProductFileRow() {
        }
        return SupplierProductFileRow;
    }());
    exports.SupplierProductFileRow = SupplierProductFileRow;
});



define('domain/orderItem',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OrderItem = (function () {
        function OrderItem() {
        }
        return OrderItem;
    }());
    exports.OrderItem = OrderItem;
});



define('domain/supplier',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Supplier = (function () {
        function Supplier() {
        }
        return Supplier;
    }());
    exports.Supplier = Supplier;
});



define('domain/foodServiceSupplier',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FoodServiceSupplier = (function () {
        function FoodServiceSupplier() {
        }
        return FoodServiceSupplier;
    }());
    exports.FoodServiceSupplier = FoodServiceSupplier;
});



define('domain/priceList',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PriceList = (function () {
        function PriceList() {
        }
        return PriceList;
    }());
    exports.PriceList = PriceList;
});



define('domain/foodService',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FoodService = (function () {
        function FoodService() {
        }
        return FoodService;
    }());
    exports.FoodService = FoodService;
});



define('domain/supplierProductFile',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupplierProductFile = (function () {
        function SupplierProductFile() {
        }
        return SupplierProductFile;
    }());
    exports.SupplierProductFile = SupplierProductFile;
});



define('domain/simulationItem',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimulationItem = (function () {
        function SimulationItem() {
        }
        return SimulationItem;
    }());
    exports.SimulationItem = SimulationItem;
});



define('domain/product',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Product = (function () {
        function Product() {
        }
        return Product;
    }());
    exports.Product = Product;
});



define('domain/simulationInputItem',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimulationInputItem = (function () {
        function SimulationInputItem() {
        }
        return SimulationInputItem;
    }());
    exports.SimulationInputItem = SimulationInputItem;
});



define('domain/checkDeliveryResult',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CheckDeliveryResult = (function () {
        function CheckDeliveryResult() {
        }
        return CheckDeliveryResult;
    }());
    exports.CheckDeliveryResult = CheckDeliveryResult;
});



define('domain/consultaCepResult',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConsultaCepResult = (function () {
        function ConsultaCepResult() {
        }
        return ConsultaCepResult;
    }());
    exports.ConsultaCepResult = ConsultaCepResult;
});



define('domain/marketRule',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MarketRule = (function () {
        function MarketRule() {
        }
        return MarketRule;
    }());
    exports.MarketRule = MarketRule;
});



define('domain/simulationSummaryItem',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimulationSummaryItem = (function () {
        function SimulationSummaryItem() {
        }
        return SimulationSummaryItem;
    }());
    exports.SimulationSummaryItem = SimulationSummaryItem;
});



define('domain/foodServiceStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FoodServiceStatus;
    (function (FoodServiceStatus) {
        FoodServiceStatus[FoodServiceStatus["Active"] = 0] = "Active";
        FoodServiceStatus[FoodServiceStatus["Inactive"] = 1] = "Inactive";
        FoodServiceStatus[FoodServiceStatus["WaitingToApprove"] = 2] = "WaitingToApprove";
    })(FoodServiceStatus = exports.FoodServiceStatus || (exports.FoodServiceStatus = {}));
});



define('domain/simulationResultItem',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimulationResultItem = (function () {
        function SimulationResultItem() {
        }
        return SimulationResultItem;
    }());
    exports.SimulationResultItem = SimulationResultItem;
});



define('domain/productViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProductViewModel = (function () {
        function ProductViewModel() {
        }
        return ProductViewModel;
    }());
    exports.ProductViewModel = ProductViewModel;
});



define('domain/supplierStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupplierStatus;
    (function (SupplierStatus) {
        SupplierStatus[SupplierStatus["Active"] = 0] = "Active";
        SupplierStatus[SupplierStatus["Inactive"] = 1] = "Inactive";
        SupplierStatus[SupplierStatus["WaitingToApprove"] = 2] = "WaitingToApprove";
    })(SupplierStatus = exports.SupplierStatus || (exports.SupplierStatus = {}));
});



define('domain/invoiceControl',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InvoiceControl = (function () {
        function InvoiceControl() {
        }
        return InvoiceControl;
    }());
    exports.InvoiceControl = InvoiceControl;
});



define('domain/foodServiceViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FoodServiceConnectionViewModel = (function () {
        function FoodServiceConnectionViewModel() {
        }
        return FoodServiceConnectionViewModel;
    }());
    exports.FoodServiceConnectionViewModel = FoodServiceConnectionViewModel;
});



define('domain/welcomeUser',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WelcomeUser = (function () {
        function WelcomeUser() {
        }
        return WelcomeUser;
    }());
    exports.WelcomeUser = WelcomeUser;
});



define('domain/cotacaoViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CotacaoViewModel = (function () {
        function CotacaoViewModel() {
        }
        return CotacaoViewModel;
    }());
    exports.CotacaoViewModel = CotacaoViewModel;
});



define('domain/editSupplierStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditSupplierStatus = (function () {
        function EditSupplierStatus() {
        }
        return EditSupplierStatus;
    }());
    exports.EditSupplierStatus = EditSupplierStatus;
});



define('domain/order',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Order = (function () {
        function Order() {
        }
        return Order;
    }());
    exports.Order = Order;
});



define('domain/simulationInput',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimulationInput = (function () {
        function SimulationInput() {
            this.items = [];
        }
        return SimulationInput;
    }());
    exports.SimulationInput = SimulationInput;
});



define('domain/priceListItem',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PriceListItem = (function () {
        function PriceListItem() {
        }
        return PriceListItem;
    }());
    exports.PriceListItem = PriceListItem;
});



define('domain/evaluation',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Evaluation = (function () {
        function Evaluation() {
        }
        return Evaluation;
    }());
    exports.Evaluation = Evaluation;
});



define('domain/notification',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Notification = (function () {
        function Notification() {
        }
        return Notification;
    }());
    exports.Notification = Notification;
});



define('domain/alterBuyListProductViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlterBuyListProductViewModel = (function () {
        function AlterBuyListProductViewModel() {
        }
        return AlterBuyListProductViewModel;
    }());
    exports.AlterBuyListProductViewModel = AlterBuyListProductViewModel;
});



define('domain/evaluationStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EvaluationStatus;
    (function (EvaluationStatus) {
        EvaluationStatus[EvaluationStatus["Created"] = 0] = "Created";
        EvaluationStatus[EvaluationStatus["Approved"] = 1] = "Approved";
        EvaluationStatus[EvaluationStatus["Rejected"] = 2] = "Rejected";
        EvaluationStatus[EvaluationStatus["Blocked"] = 3] = "Blocked";
    })(EvaluationStatus = exports.EvaluationStatus || (exports.EvaluationStatus = {}));
});



define('domain/checkDeliveryViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CheckDeliveryViewModel = (function () {
        function CheckDeliveryViewModel() {
            this.suppliers = new Array();
        }
        return CheckDeliveryViewModel;
    }());
    exports.CheckDeliveryViewModel = CheckDeliveryViewModel;
});



define('domain/unitOfMeasurement',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitOfMeasurement = (function () {
        function UnitOfMeasurement() {
        }
        return UnitOfMeasurement;
    }());
    exports.UnitOfMeasurement = UnitOfMeasurement;
});



define('domain/userType',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserType;
    (function (UserType) {
        UserType[UserType["Supplier"] = 0] = "Supplier";
        UserType[UserType["FoodService"] = 1] = "FoodService";
        UserType[UserType["Admin"] = 2] = "Admin";
    })(UserType = exports.UserType || (exports.UserType = {}));
});



define('domain/productCategory',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProductCategory = (function () {
        function ProductCategory() {
        }
        return ProductCategory;
    }());
    exports.ProductCategory = ProductCategory;
});



define('domain/userStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserStatus;
    (function (UserStatus) {
        UserStatus[UserStatus["Active"] = 0] = "Active";
        UserStatus[UserStatus["Inactive"] = 1] = "Inactive";
        UserStatus[UserStatus["WaitingToConfirmInvite"] = 2] = "WaitingToConfirmInvite";
        UserStatus[UserStatus["WaitingToConfirmPassword"] = 3] = "WaitingToConfirmPassword";
    })(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
});



define('domain/blockSupplierConnectionViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BlockSupplierConnectionViewModel = (function () {
        function BlockSupplierConnectionViewModel() {
        }
        return BlockSupplierConnectionViewModel;
    }());
    exports.BlockSupplierConnectionViewModel = BlockSupplierConnectionViewModel;
});



define('domain/rejectOrderViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RejectOrderViewModel = (function () {
        function RejectOrderViewModel() {
        }
        return RejectOrderViewModel;
    }());
    exports.RejectOrderViewModel = RejectOrderViewModel;
});



define('domain/supplierProduct',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupplierProduct = (function () {
        function SupplierProduct() {
        }
        return SupplierProduct;
    }());
    exports.SupplierProduct = SupplierProduct;
});



define('domain/checkDeliveryResultItem',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CheckDeliveryResultItem = (function () {
        function CheckDeliveryResultItem() {
        }
        return CheckDeliveryResultItem;
    }());
    exports.CheckDeliveryResultItem = CheckDeliveryResultItem;
});



define('domain/user',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var User = (function () {
        function User() {
        }
        return User;
    }());
    exports.User = User;
});



define('domain/confirmInviteViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfirmInviteViewModel = (function () {
        function ConfirmInviteViewModel() {
        }
        return ConfirmInviteViewModel;
    }());
    exports.ConfirmInviteViewModel = ConfirmInviteViewModel;
});



define('domain/simulationResult',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimulationResult = (function () {
        function SimulationResult() {
        }
        return SimulationResult;
    }());
    exports.SimulationResult = SimulationResult;
});



define('domain/editInvoiceViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditInvoiceViewModel = (function () {
        function EditInvoiceViewModel() {
        }
        return EditInvoiceViewModel;
    }());
    exports.EditInvoiceViewModel = EditInvoiceViewModel;
});



define('domain/orderStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OrderStatus;
    (function (OrderStatus) {
        OrderStatus[OrderStatus["Created"] = 0] = "Created";
        OrderStatus[OrderStatus["Accepted"] = 1] = "Accepted";
        OrderStatus[OrderStatus["Delivered"] = 2] = "Delivered";
        OrderStatus[OrderStatus["Rejected"] = 3] = "Rejected";
    })(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
});



define('domain/deliveryRule',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeliveryRule = (function () {
        function DeliveryRule() {
        }
        DeliveryRule.getNextDeliveryDate = function (rule) {
            var isFound = false;
            var count = 0;
            var days = [
                rule.deliveryOnSunday,
                rule.deliveryOnMonday,
                rule.deliveryOnTuesday,
                rule.deliveryOnWednesday,
                rule.deliveryOnThursday,
                rule.deliveryOnFriday,
                rule.deliveryOnSaturday
            ];
            var today = new Date();
            var dayToday = today.getDay();
            var day = dayToday + 1;
            while (isFound == false) {
                if (count >= days.length + 1) {
                    break;
                }
                if (days[day]) {
                    isFound = true;
                    break;
                }
                count++;
                if (day >= days.length - 1) {
                    day = 0;
                }
                else {
                    day++;
                }
            }
            if (day == dayToday) {
                day = 7;
            }
            else if (day < dayToday) {
                day += (7 - dayToday);
            }
            else {
                day -= dayToday;
            }
            if (isFound) {
                var x = new Date(today.getTime() + (1000 * 60 * 60 * 24 * day));
                x.setHours(0, 0, 0, 0);
                return x;
            }
            return null;
        };
        return DeliveryRule;
    }());
    exports.DeliveryRule = DeliveryRule;
});



define('domain/buyListStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuyListStatus;
    (function (BuyListStatus) {
        BuyListStatus[BuyListStatus["Active"] = 0] = "Active";
        BuyListStatus[BuyListStatus["Inactive"] = 1] = "Inactive";
    })(BuyListStatus = exports.BuyListStatus || (exports.BuyListStatus = {}));
});



define('domain/SupplierProductStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupplierProductStatus;
    (function (SupplierProductStatus) {
        SupplierProductStatus[SupplierProductStatus["Active"] = 0] = "Active";
        SupplierProductStatus[SupplierProductStatus["Inactive"] = 1] = "Inactive";
        SupplierProductStatus[SupplierProductStatus["Removed"] = 2] = "Removed";
    })(SupplierProductStatus = exports.SupplierProductStatus || (exports.SupplierProductStatus = {}));
});



define('domain/address',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Address = (function () {
        function Address() {
        }
        return Address;
    }());
    exports.Address = Address;
});



define('domain/supplierViewModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupplierViewModel = (function () {
        function SupplierViewModel() {
        }
        return SupplierViewModel;
    }());
    exports.SupplierViewModel = SupplierViewModel;
});



define('domain/city',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var City = (function () {
        function City() {
        }
        return City;
    }());
    exports.City = City;
});



define('domain/simulation',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Simulation = (function () {
        function Simulation() {
        }
        return Simulation;
    }());
    exports.Simulation = Simulation;
});



define('domain/buyList',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuyList = (function () {
        function BuyList() {
        }
        return BuyList;
    }());
    exports.BuyList = BuyList;
});



define('domain/editFoodServiceStatus',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditFoodServiceStatus = (function () {
        function EditFoodServiceStatus() {
        }
        return EditFoodServiceStatus;
    }());
    exports.EditFoodServiceStatus = EditFoodServiceStatus;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/messageService',["require", "exports", "./identityService", "aurelia-framework", "aurelia-event-aggregator", "aurelia-api"], function (require, exports, identityService_1, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageService = (function () {
        function MessageService(service, ea, config) {
            this.service = service;
            this.ea = ea;
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        MessageService.prototype.subscribe = function () {
            if (this.config.getEndpoint('csz').client.baseUrl.indexOf('https') != -1) {
                var address = this.config.getEndpoint('csz').client.baseUrl.replace('https://', '').replace('/api/', '');
                var ws = new WebSocket('wss://' + address + '/hubs/foodServiceSupplierConnection');
            }
            else {
                var address = this.config.getEndpoint('csz').client.baseUrl.replace('http://', '').replace('/api/', '');
                var ws = new WebSocket('ws://' + address + '/hubs/foodServiceSupplierConnection');
            }
            var other = this;
            var user = this.service.getIdentity();
            ws.onopen = function () {
                ws.send('{ "protocol": "json", "version": 1 }\x1e');
                console.log('Opened!');
                ws.send(JSON.stringify({
                    type: 1,
                    invocationId: user.id,
                    xonnectionId: user.id,
                    target: 'Register',
                    arguments: [user.id],
                    nonBlocking: false
                }) + "\x1e");
            };
            ws.onmessage = function (event) {
                var data;
                data = (event.data);
                data = data.replace('', '');
                var msg = JSON.parse(data);
                if (msg.type == 1) {
                    debugger;
                    other.ea.publish('newNotification', msg.arguments[0]);
                }
            };
            ws.onclose = function (event) {
                console.log('Closed!');
            };
            ws.onerror = function (event) {
                console.log('Error!');
                console.log(event);
            };
        };
        MessageService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [identityService_1.IdentityService, aurelia_event_aggregator_1.EventAggregator, aurelia_api_1.Config])
        ], MessageService);
        return MessageService;
    }());
    exports.MessageService = MessageService;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/notificationService',["require", "exports", "toastr", "aurelia-framework", "aurelia-router"], function (require, exports, toastr, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationService = (function () {
        function NotificationService(router, aurelia) {
            this.router = router;
            this.aurelia = aurelia;
            toastr.options = {
                closeButton: true,
                showEasing: 'swing',
                hideEasing: 'linear',
                showMethod: 'fadeIn',
                hideMethod: 'fadeOut',
                positionClass: 'toast-bottom-right',
                extendedTimeOut: 0,
                timeOut: 2000
            };
        }
        NotificationService.prototype.error = function (error) {
            var _this = this;
            if (error.message != null) {
                if (Array.isArray(error.message)) {
                    error.message.forEach(function (message) { return _this.presentError(message); });
                }
                else {
                    this.presentError(error.message);
                }
            }
            else
                this.presentError(error);
        };
        NotificationService.prototype.success = function (success) {
            if (success.message != null)
                this.presentSuccess(success.message);
            else
                this.presentSuccess(success);
        };
        NotificationService.prototype.presentError = function (message) {
            toastr.error(message, 'Erro');
        };
        NotificationService.prototype.presentSuccess = function (message) {
            toastr.success(message, 'Sucesso');
        };
        NotificationService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router, aurelia_framework_1.Aurelia])
        ], NotificationService);
        return NotificationService;
    }());
    exports.NotificationService = NotificationService;
});



define('services/scriptRunner',["require", "exports", "velocity"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScriptRunner = (function () {
        function ScriptRunner() {
        }
        ScriptRunner.runScript = function () {
            $(document).ready(function () {
                var dynamicDuration = 300;
                var dynamicDelay = 0;
                var animateCSSClass = 'fadeInUp';
                var uniqueTimeStamp = new Date().getTime();
                var waitForFinalEvent = (function () {
                    var timers = {};
                    return function (callback, ms, uniqueId) {
                        if (!uniqueId) {
                            uniqueId = 'unique id';
                        }
                        if (timers[uniqueId]) {
                            clearTimeout(timers[uniqueId]);
                        }
                        timers[uniqueId] = setTimeout(callback, ms);
                    };
                })();
                function qp_required_misc() {
                    $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
                        if (!$(this).next().hasClass('show')) {
                            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
                        }
                        var subMenu = $(this).next(".dropdown-menu");
                        subMenu.toggleClass('show');
                        subMenu.prev().toggleClass('show');
                        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
                            $('.dropdown-submenu .show').removeClass("show");
                        });
                        return false;
                    });
                    $('.btn-gradient').each(function () {
                        var thisBtn = $(this);
                        var btnContent = thisBtn.html();
                        var btnContentNew = '<span class="gradient">' + btnContent + '</span>';
                        thisBtn.html(btnContentNew);
                    });
                    qp_add_scrollbar('.card-media-list', 'dark');
                    $('.has-scroll').each(function () {
                        qp_add_scrollbar($(this), 'dark');
                    });
                    $('.card-header').each(function () {
                        var thisHeader = $(this);
                        if (thisHeader.height() > 40) {
                            thisHeader.find('.header-btn-block').css({ 'top': '31px' });
                        }
                    });
                    var parentLink = 'a.nav-parent';
                    if ($(parentLink).length) {
                        $('a.nav-parent').on('click', function (e) {
                            var clickedLink = $(this);
                            if (clickedLink.closest('li').hasClass('open')) {
                                clickedLink.closest('li').removeClass('open');
                                clickedLink.siblings('ul.nav').velocity('slideUp', {
                                    easing: 'easeOutCubic',
                                    duration: dynamicDuration,
                                    delay: dynamicDelay,
                                    complete: function (elements) {
                                        clickedLink.closest('li').find('li').removeClass('open');
                                        clickedLink.closest('li').find('ul.nav').removeAttr('style');
                                    }
                                });
                            }
                            else {
                                clickedLink.closest('li').addClass('open');
                                clickedLink.siblings('ul.nav').velocity('slideDown', {
                                    easing: 'easeOutCubic',
                                    duration: dynamicDuration,
                                    delay: dynamicDelay,
                                    complete: function (elements) {
                                    }
                                });
                                clickedLink.closest('li').siblings('li.nav-item.open').find('ul.nav').velocity('slideUp', {
                                    easing: 'easeOutCubic',
                                    duration: dynamicDuration,
                                    delay: dynamicDelay,
                                    complete: function (elements) {
                                        $(this).removeAttr('style');
                                        $(this).closest('li').removeClass('open');
                                    }
                                });
                                clickedLink.closest('ul').siblings('ul.nav').find('ul.nav').velocity('slideUp', {
                                    easing: 'easeOutCubic',
                                    duration: dynamicDuration,
                                    delay: dynamicDelay,
                                    complete: function (elements) {
                                        $(this).closest('li').removeClass('open');
                                        $(this).closest('li').removeClass('open');
                                    }
                                });
                            }
                            e.preventDefault();
                        });
                    }
                    var sidebarNav = 'nav.sidebar';
                    if ($(sidebarNav).length) {
                        var windowHeight = $(window).height();
                        $(sidebarNav).height(windowHeight);
                        $(sidebarNav).mCustomScrollbar("destroy");
                        qp_add_scrollbar('nav.sidebar', 'light');
                        $('.sidebar > .mCustomScrollBox').before('<button class="hamburger hamburger--slider" type="button" data-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle Sidebar"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');
                        $(window).resize(function () {
                            waitForFinalEvent(function () {
                                var windowHeight = $(window).height();
                                $(sidebarNav).height(windowHeight);
                                $(sidebarNav).mCustomScrollbar("destroy");
                                $('.sidebar .hamburger').remove();
                                qp_add_scrollbar('nav.sidebar', 'light');
                                $('.sidebar > .mCustomScrollBox').before('<button class="hamburger hamburger--slider" type="button" data-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle Sidebar"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');
                            }, 500, 'RandomUniqueString');
                        });
                    }
                    $(document).on('click', 'button.hamburger', function (e) {
                        var mainNavbarHeight = $('.navbar-sidebar-horizontal').outerHeight();
                        $('.sidebar-horizontal.fixed-top').css({ 'top': mainNavbarHeight + 'px' });
                        if ($('.hamburger').hasClass('is-active')) {
                            $('.hamburger').removeClass('is-active');
                            $('#sidebar').removeClass('open');
                            $('.sidebar-horizontal').slideUp().promise().always(function () {
                                $(this).removeAttr('style');
                            });
                        }
                        else {
                            $('.hamburger').addClass('is-active');
                            $('#sidebar').addClass('open');
                            $('.sidebar-horizontal').slideDown();
                        }
                        e.preventDefault();
                    });
                    $('.input-group .form-control').focus(function () {
                        $(this).closest('.input-group').addClass('focus');
                    });
                    $('.input-group .form-control').blur(function () {
                        $(this).closest('.input-group').removeClass('focus');
                    });
                    $('[data-toggle="popover"]').popover();
                    $('[data-toggle="tooltip"]').tooltip();
                    $('[data-qp-link]').on('click', function (e) {
                        window.location = $(this).data('qp-link');
                        e.preventDefault();
                    });
                    var signInLeftColumn = '.signin-left-column';
                    if ($(signInLeftColumn).length) {
                        var windowHeight = $(window).height();
                        if (windowHeight > 630) {
                            $(signInLeftColumn).css({ 'height': windowHeight + 'px' });
                        }
                        $(window).resize(function () {
                            waitForFinalEvent(function () {
                                var windowHeight = $(window).height();
                                if (windowHeight > 630) {
                                    $(signInLeftColumn).css({ 'height': windowHeight + 'px' });
                                }
                            }, 500, 'randomStringForSignupPage');
                        });
                    }
                    var signInRightColumn = '.signin-right-column';
                    if ($(signInRightColumn).length) {
                        if ((typeof ($(signInRightColumn).data('qp-bg-image')) !== 'undefined') && ($(signInRightColumn).data('qp-bg-image') != '')) {
                            var backgroundImage = $(signInRightColumn).data('qp-bg-image');
                            $(signInRightColumn).css({ 'background-image': 'url(assets/img/' + backgroundImage + ')' });
                        }
                    }
                    var placeholder = '.load-ckeditor';
                    if ($(placeholder).length) {
                        $(placeholder).ckeditor();
                    }
                    var customColorControl = $('.custom-color-control.custom-control.custom-radio');
                    if (customColorControl.length) {
                        $('.custom-color-control.custom-control.custom-radio').each(function () {
                            var thisObj = $(this);
                            var color = thisObj.data('qp-color');
                            thisObj.find('.custom-control-indicator').css({ 'background-color': color });
                        });
                    }
                    qp_animate_css();
                    if ($('.dropdown-menu-fullscreen').length) {
                        var rightColumnWidth = $('.right-column').width();
                        $('.dropdown-menu-fullscreen').css({ 'width': rightColumnWidth + 'px' });
                        $('.dropdown-menu-fullscreen').closest('.nav-item').css({ 'position': 'static' });
                        $(window).resize(function () {
                            waitForFinalEvent(function () {
                                var rightColumnWidth = $('.right-column').width();
                                $('.dropdown-menu-fullscreen').css({ 'width': rightColumnWidth + 'px' });
                            }, 500, uniqueTimeStamp);
                        });
                    }
                    var windowWidth = $(window).width();
                    $('.dropdown-toggle').on('click', function () {
                        if ($(window).width() <= 576) {
                            $(this).siblings('.dropdown-menu').each(function () {
                                if (!$(this).hasClass('dropdown-menu-fullscreen')) {
                                    $(this).css({ 'position': 'absolute', 'width': windowWidth + 'px' });
                                    $(this).closest('.dropdown').css({ 'position': 'static' });
                                }
                            });
                        }
                        else {
                            $(this).siblings('.dropdown-menu').each(function () {
                                if (!$(this).hasClass('dropdown-menu-fullscreen')) {
                                    $(this).removeAttr('style');
                                    $(this).closest('.dropdown').removeAttr('style');
                                }
                            });
                        }
                    });
                    $(window).resize(function () {
                        waitForFinalEvent(function () {
                            if ($(window).width() <= 576) {
                                $('.dropdown-toggle').on('click', function () {
                                    var windowWidth = $(window).width();
                                    $(this).siblings('.dropdown-menu').each(function () {
                                        if (!$(this).hasClass('dropdown-menu-fullscreen')) {
                                            $(this).css({ 'position': 'absolute', 'width': windowWidth + 'px' });
                                            $(this).closest('.dropdown').css({ 'position': 'static' });
                                        }
                                    });
                                });
                            }
                            else {
                                if (!$(this).hasClass('dropdown-menu-fullscreen')) {
                                    $(this).siblings('.dropdown-menu').removeAttr('style');
                                    $(this).siblings('.dropdown-menu').closest('.dropdown').removeAttr('style');
                                }
                            }
                        }, 500, 'uniqueTimeStamp+345');
                    });
                    $('[data-toggle=offcanvas]').click(function () {
                        $('.row-offcanvas').toggleClass('active');
                    });
                    $('.no-waves-effect').removeClass('waves-effect');
                }
                function qp_animate_css() {
                    if (!$('body').hasClass('no-animation')) {
                        $('[data-qp-animate-type]').each(function () {
                            var mainElement = $(this);
                            if (mainElement.visible(true) || mainElement.closest('nav').hasClass('sidebar')) {
                                load_animation(mainElement);
                            }
                            $(window).scroll(function () {
                                if (mainElement.visible(true)) {
                                    load_animation(mainElement);
                                }
                            });
                            function load_animation(mainElement) {
                                var animationName = '';
                                if (typeof (mainElement.data('qp-animate-type')) === 'undefined') {
                                    var animationName = 'fadeInDown';
                                }
                                else {
                                    animationName = mainElement.data('qp-animate-type');
                                }
                                if (typeof (mainElement.data('qp-animate-delay')) === 'undefined') {
                                    var timeoutDelay = 0;
                                }
                                else {
                                    timeoutDelay = mainElement.data('qp-animate-delay');
                                }
                                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                                if (mainElement.hasClass('invisible')) {
                                    setTimeout(function () {
                                        mainElement.removeClass('invisible').addClass('animated ' + animationName).one(animationEnd, function () {
                                            $(this).removeClass(animationName);
                                            $(this).removeClass('animated');
                                            $(this).removeClass('infinite');
                                        });
                                    }, timeoutDelay);
                                }
                                if (mainElement.hasClass('invisible-children')) {
                                    mainElement.children().each(function () {
                                        var thisElement = $(this);
                                        setTimeout(function () {
                                            thisElement.addClass('animated ' + animationName).one(animationEnd, function () {
                                            });
                                        }, timeoutDelay);
                                        timeoutDelay += 75;
                                    });
                                }
                                if (mainElement.hasClass('invisible-children-with-scrollbar')) {
                                    mainElement.children('.mCustomScrollBox').find('.mCSB_container').children().each(function () {
                                        var thisElement = $(this);
                                        setTimeout(function () {
                                            thisElement.addClass('animated ' + animationName).one(animationEnd, function () {
                                            });
                                        }, timeoutDelay);
                                        timeoutDelay += 75;
                                    });
                                }
                            }
                        });
                    }
                }
                function qp_hexToRgbA(hex, alpha) {
                    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
                    if (alpha) {
                        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
                    }
                    else {
                        return "rgb(" + r + ", " + g + ", " + b + ")";
                    }
                }
                function qp_add_scrollbar(scrollContainer, scrollBarTheme) {
                    var colorPresetGlobal = $('body').data('color-preset');
                    $(scrollContainer).mCustomScrollbar({
                        autoHideScrollbar: true,
                        scrollbarPosition: 'inside',
                        theme: scrollBarTheme,
                        mouseWheel: {
                            preventDefault: true
                        }
                    });
                }
                function qp_chart_sizes(chartID) {
                    var chartWidth;
                    var chartHeight;
                    chartWidth = $(chartID).parent().width();
                    if (typeof ($(chartID).closest('.card-chart').data('chart-height')) === 'undefined') {
                        chartHeight = 281;
                    }
                    else {
                        if (chartWidth < 300) {
                            chartHeight = 281;
                        }
                        else {
                            chartHeight = $(chartID).closest('.card-chart').data('chart-height');
                        }
                    }
                    var chartSizes = [chartWidth, chartHeight];
                    return chartSizes;
                }
                function qp_timeline() {
                    var timelineContainer = '.timeline';
                    if ($(timelineContainer).length) {
                        $(timelineContainer).each(function () {
                            $(this).timelify({
                                animRight: "fadeInRight",
                                animLeft: "fadeInLeft",
                                animCenter: "fadeInUp"
                            });
                        });
                    }
                }
                function qp_calendar() {
                    var calendarContainer = '#calendar';
                    if ($(calendarContainer).length) {
                        $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-menu .legend-block-item .legend-block-color-box, .calendar-controls .available-events .fc-event .legend-block-item .legend-block-color-box").each(function () {
                            var eventColor = $(this).data("event-color");
                            var highlightColor = "highlight-color-" + eventColor;
                            var bgColor = "highlight-color-" + eventColor;
                            $(this).addClass(bgColor);
                        });
                        $("#add-available-event").on("click", function () {
                            var eventColorActive = $(this).siblings(".dropdown-menu").find(".legend-block-item.active .legend-block-color-box").data("event-color");
                            var eventName = $(this).parent().siblings("#input-new-event").val().trim();
                            $(this).parent().siblings("#input-new-event").val("");
                            if (eventName != "") {
                                var newEventContent = "<div class='fc-event' style='opacity:0;'><div class='legend-block-item'><div class='legend-block-color'><div class='legend-block-color-box highlight-color-" + eventColorActive + "' data-event-color='" + eventColorActive + "'><i class='batch-icon batch-icon-droplet'></i></div></div><div class='legend-block-text'>" + eventName + "</div></div></div>";
                                $(this).closest(".calendar-controls").find(".available-events .event-list").prepend(newEventContent);
                                $(this).closest(".calendar-controls").find(".available-events .fc-event").first().delay(200).animate({ "opacity": "1" }, 300);
                                $(this).closest(".card-body").find('.calendar-controls .fc-event').each(function () {
                                    var thisEventColor = $(this).find(".legend-block-color-box").data("event-color");
                                    var eventObject = {
                                        title: $.trim($(this).text()),
                                        className: "highlight-color-" + thisEventColor,
                                    };
                                    $(this).data('event', eventObject);
                                    $(this).draggable({
                                        zIndex: 999,
                                        revert: true,
                                        revertDuration: 0
                                    });
                                });
                            }
                            else {
                                $("#input-new-event").focus();
                            }
                        });
                        getActiveColor();
                        var getActiveColor = function () {
                            var eventColorActive = $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-menu .legend-block-item.active .legend-block-color-box").data("event-color");
                            var theButton = $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-toggle");
                            var colorIndicator = theButton.closest('.input-group-btn').siblings('.input-group-addon');
                            theButton.addClass("highlight-color-" + eventColorActive);
                            colorIndicator.addClass("highlight-color-" + eventColorActive);
                            var listItem = $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-menu .legend-block-item");
                            listItem.on("click", function () {
                                var newEventColor = $(this).find(".legend-block-color-box").data("event-color");
                                var regex = new RegExp('\\b' + 'highlight-color-' + '.+?\\b', 'g');
                                theButton[0].className = theButton[0].className.replace(regex, '');
                                theButton.addClass("highlight-color-" + newEventColor);
                                colorIndicator.removeAttr('class').addClass("input-group-addon highlight-color-" + newEventColor);
                                $(this).siblings().removeClass("active");
                                $(this).addClass('active');
                                $("#input-new-event").focus();
                            });
                        };
                        $(calendarContainer).closest(".card-body").find('.calendar-controls .fc-event').each(function () {
                            var thisEventColor = $(this).find(".legend-block-color-box").data("event-color");
                            $(this).data('event', {
                                title: $.trim($(this).text()),
                                className: "highlight-color-" + thisEventColor,
                                stick: true
                            });
                            $(this).draggable({
                                zIndex: 999,
                                revert: true,
                                revertDuration: 0
                            });
                        });
                        $(calendarContainer).fullCalendar({
                            header: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'month,agendaWeek,agendaDay'
                            },
                            themeSystem: 'bootstrap3',
                            defaultDate: '2017-11-12',
                            editable: true,
                            droppable: true,
                            eventLimit: true,
                            events: [
                                {
                                    title: 'All Day Event',
                                    start: '2017-11-01',
                                    className: "highlight-color-red"
                                },
                                {
                                    title: 'Long Event',
                                    start: '2017-11-07',
                                    end: '2017-11-10',
                                    className: "highlight-color-yellow"
                                },
                                {
                                    id: 999,
                                    title: 'Repeating Event',
                                    start: '2017-11-09T16:00:00',
                                    color: "#ff0097"
                                },
                                {
                                    id: 999,
                                    title: 'Repeating Event',
                                    start: '2017-11-16T16:00:00',
                                    className: "highlight-color-purple"
                                },
                                {
                                    title: 'Conference',
                                    start: '2017-11-11',
                                    end: '2017-11-13',
                                    className: "highlight-color-green"
                                },
                                {
                                    title: 'Meeting',
                                    start: '2017-11-12T10:30:00',
                                    end: '2017-11-12T12:30:00',
                                    className: "highlight-color-green"
                                },
                                {
                                    title: 'Lunch',
                                    start: '2017-11-12T12:00:00',
                                    color: "#6ec06e"
                                },
                                {
                                    title: 'Meeting',
                                    start: '2017-11-12T14:30:00',
                                    className: "highlight-color-red"
                                },
                                {
                                    title: 'Happy Hour',
                                    start: '2017-11-12T17:30:00',
                                    className: "highlight-color-red"
                                },
                                {
                                    title: 'Dinner',
                                    start: '2017-11-12T20:00:00',
                                    className: "highlight-color-blue"
                                },
                                {
                                    title: 'Birthday Party',
                                    start: '2017-11-13T07:00:00'
                                },
                                {
                                    title: 'Click for Google',
                                    url: 'https://base5builder.com/',
                                    start: '2017-11-28'
                                }
                            ],
                            drop: function () {
                                $(this).remove();
                            },
                            eventAfterAllRender: function () {
                                $(calendarContainer).find('.glyphicon.glyphicon-chevron-right').removeAttr('class').addClass('batch-icon batch-icon-arrow-right');
                                $(calendarContainer).find('.glyphicon.glyphicon-chevron-left').removeAttr('class').addClass('batch-icon batch-icon-arrow-left');
                            }
                        });
                    }
                }
                function qp_mailbox_list() {
                    var placeholder = '.mailbox-email-list';
                    if ($(placeholder).length) {
                        $(placeholder + ' .email-item-checkbox .custom-control-input').removeAttr('checked');
                        var selectAll = $(placeholder + ' .email-select-all .custom-checkbox');
                        selectAll.on('click', function () {
                            if ($(this).hasClass('active')) {
                                $(this).find('.custom-control-input').removeAttr('checked');
                                $(placeholder + ' .email-item-checkbox .custom-control-input').removeAttr('checked');
                                $(this).removeClass('active');
                                $(placeholder + ' .mailbox-control-group .btn').addClass('disabled');
                                $(placeholder + ' tr').removeClass("highlighted");
                            }
                            else {
                                $(this).find('.custom-control-input').attr('checked', 'checked');
                                $(placeholder + ' .email-item-checkbox .custom-control-input').attr('checked', 'checked');
                                $(this).addClass('active');
                                $(placeholder + ' .mailbox-control-group .btn').removeClass('disabled');
                                $(placeholder + ' tr').addClass("highlighted");
                            }
                            return false;
                        });
                        $(placeholder + ' .email-item-checkbox').on('click', function () {
                            var thisCheckbox = $(this);
                            var checkedCount = 0;
                            if (thisCheckbox.find('.custom-control-input').is(':checked')) {
                                thisCheckbox.find('.custom-control-input').removeAttr('checked');
                                thisCheckbox.closest('tr').removeClass("highlighted");
                                thisCheckbox.closest('tr').siblings('tr').each(function () {
                                    if ($(this).find('.custom-control-input').is(':checked')) {
                                        checkedCount++;
                                    }
                                });
                                if (checkedCount < 1) {
                                    $(placeholder + ' .mailbox-control-group .btn').addClass('disabled');
                                }
                            }
                            else {
                                thisCheckbox.find('.custom-control-input').attr('checked', 'checked');
                                thisCheckbox.closest('tr').addClass("highlighted");
                                $(placeholder + ' .mailbox-control-group .btn').removeClass('disabled');
                            }
                            return false;
                        });
                        $(".email-refresh").on("click", function (e) {
                            location.reload();
                            e.preventDefault();
                        });
                        $(".email-mark-read").on("click", function (e) {
                            $(".mailbox-email-list tr").each(function () {
                                if ($(this).hasClass('email-status-unread') && $(this).find('.email-checkbox .custom-control-input').is(':checked')) {
                                    $(this).removeClass("email-status-unread");
                                }
                                else if (!$(this).hasClass('email-status-unread') && $(this).find('.email-checkbox .custom-control-input').is(':checked')) {
                                    $(this).addClass("email-status-unread");
                                }
                            });
                            e.preventDefault();
                        });
                        $(".email-delete").on("click", function (e) {
                            $(".mailbox-email-list tr").each(function () {
                                if ($(this).find('.email-checkbox .custom-control-input').is(':checked')) {
                                    $(this).velocity('slideUp', {
                                        easing: 'easeOutCubic',
                                        duration: dynamicDuration,
                                        delay: dynamicDelay,
                                        complete: function (elements) {
                                            $(this).remove();
                                        }
                                    });
                                }
                            });
                            $(".alert").remove();
                            var messageDeleteText = '<strong>Deleted!</strong> Email(s) deleted.';
                            var messageDelete = '<div class="alert alert-success alert-dismissable" style="opacity:0;"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>' + messageDeleteText + '</div>';
                            $(".mailbox-controls").after(messageDelete);
                            $(".alert").animate({ "opacity": 1 }, 300);
                            $(".email-mark-read, .email-mark-important, .email-mark-junk, .email-delete").addClass("disabled");
                            selectAll.find('.custom-control-input').removeAttr('checked');
                            e.preventDefault();
                        });
                        $(".email-mark-junk").on("click", function (e) {
                            $(".mailbox-email-list tr").each(function () {
                                if ($(this).find('.email-checkbox .custom-control-input').is(':checked')) {
                                    $(this).velocity('slideUp', {
                                        easing: 'easeOutCubic',
                                        duration: dynamicDuration,
                                        delay: dynamicDelay,
                                        complete: function (elements) {
                                            $(this).remove();
                                        }
                                    });
                                }
                            });
                            $(".alert").remove();
                            var messageJunkText = '<strong>Moved!</strong> Email(s) have been moved to the Junk Folder.';
                            var messageJunk = '<div class="alert alert-success alert-dismissable" style="opacity:0;"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>' + messageJunkText + '</div>';
                            $(".mailbox-controls").after(messageJunk);
                            $(".alert").animate({ "opacity": 1 }, 300);
                            $(".email-mark-read, .email-mark-important, .email-mark-junk, .email-delete").addClass("disabled");
                            selectAll.find('.custom-control-input').removeAttr('checked');
                            e.preventDefault();
                        });
                        $(".mailbox-email-list tr").each(function () {
                            $(this).find(".email-star").on("click", function () {
                                $(this).find(".email-star-status").toggleClass("checked");
                            });
                            var emailURL = $(this).data("email-url");
                            $(this).find(".email-sender, .email-subject, .email-datetime").on("click", function () {
                                window.location.href = emailURL;
                            });
                        });
                    }
                }
                function qp_mailbox_message_view() {
                    if ($("#show-others").length) {
                        $("#show-others").on("click", function (e) {
                            $(".message-recepient-others").slideToggle(300);
                            e.preventDefault();
                        });
                    }
                }
                function qp_datatables() {
                    var placeholder = '.table-datatable';
                    if ($(placeholder).length) {
                        $(placeholder).each(function () {
                            $(this).DataTable();
                        });
                    }
                }
                function qp_task_list() {
                    var taskList = '.card-task-list';
                    if ($(taskList).length) {
                        if ($(taskList).closest('.card').hasClass('card-xs') || $(taskList).closest('.card').hasClass('card-sm') || $(taskList).closest('.card').hasClass('card-md') || $(taskList).closest('.card').hasClass('card-lg')) {
                            qp_add_scrollbar(taskList, 'dark');
                        }
                        var taskListItem = $(taskList + ' .task-list-item .custom-checkbox');
                        var taskCount = function (addCount) {
                            if (typeof (addCount) === 'undefined') {
                                addCount = 0;
                            }
                            var tasksCompleted = taskListItem.closest('.card-task-list').find("label.active").length + addCount;
                            var tasksTotal = taskListItem.closest('.card-task-list').find(".task-list-item").length;
                            taskListItem.closest('.card').find(".card-header .task-list-stats .task-list-completed").text(tasksCompleted);
                            taskListItem.closest('.card').find(".card-header .task-list-stats .task-list-total").text(tasksTotal);
                            var completionPercentage = (tasksCompleted / tasksTotal) * 100;
                            var progressBar = taskListItem.closest('.card').find(".card-header .progress-bar");
                            progressBar.css({ "width": completionPercentage + "%" }).attr("aria-valuenow", completionPercentage);
                        };
                        taskListItem.on('click', function () {
                            $(this).button('toggle');
                            taskCount(undefined);
                            if ($(taskList).hasClass('no-strike-out')) {
                                $(this).addClass('anti-active');
                            }
                        });
                        if (!$(taskList).hasClass('no-strike-out')) {
                            taskListItem.each(function () {
                                var checkedStatus = $(this).find('.custom-control-input').is(':checked');
                                if (checkedStatus) {
                                    $(this).addClass('active');
                                }
                            });
                        }
                        taskCount(undefined);
                        $(taskList).find(".task-item-controls .show-task").on("click", function (e) {
                            $(this).closest(".task-list-item").find(".task-item-details").slideToggle(300);
                            e.preventDefault();
                        });
                    }
                }
                qp_required_misc();
                $(window).resize(function () {
                    waitForFinalEvent(function () {
                    }, 500, 'thisstringisunsdsaique');
                });
                qp_task_list();
                qp_timeline();
                qp_calendar();
                qp_mailbox_list();
                qp_mailbox_message_view();
                qp_datatables();
            });
        };
        return ScriptRunner;
    }());
    exports.ScriptRunner = ScriptRunner;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/identityService',["require", "exports", "aurelia-framework", "aurelia-fetch-client"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IdentityService = (function () {
        function IdentityService(aurelia, httpClient) {
            this.aurelia = aurelia;
            this.httpClient = httpClient;
        }
        IdentityService_1 = IdentityService;
        Object.defineProperty(IdentityService, "identity", {
            get: function () {
                if (!this._identity) {
                    this._identity = JSON.parse(localStorage.getItem('identity'));
                }
                return this._identity;
            },
            enumerable: true,
            configurable: true
        });
        IdentityService.prototype.getIdentity = function () {
            return IdentityService_1.identity;
        };
        IdentityService.prototype.setIdentity = function (identity) {
            if (!identity) {
                return;
            }
            IdentityService_1._identity = identity;
            localStorage.setItem('identity', JSON.stringify(identity));
            this.activateAuthorization();
        };
        IdentityService.prototype.isLogged = function () {
            return this.getIdentity() != null;
        };
        IdentityService.prototype.resetIdentity = function () {
            localStorage.removeItem('identity');
            localStorage.removeItem('password');
            IdentityService_1._identity = null;
        };
        IdentityService.prototype.activateAuthorization = function () {
            this.configureHttpClient(this.httpClient);
        };
        IdentityService.prototype.configureHttpClient = function (client) {
            var _this = this;
            if (client.interceptors && client.interceptors.length > 0) {
                return;
            }
            client.configure(function (config) {
                config.withDefaults({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                config.withInterceptor({
                    request: function (request) {
                        if (request.url.indexOf('viacep.com.br') == -1) {
                            if (IdentityService_1._identity) {
                                request.headers.set('authtoken', IdentityService_1._identity.token);
                            }
                        }
                        return request;
                    },
                    response: function (response) {
                        if (response.status === 401) {
                            if (IdentityService_1.isLoggingOut) {
                                return response;
                            }
                            IdentityService_1.isLoggingOut = true;
                            _this.aurelia.setRoot('App_Auth/app');
                            location.hash = '#/logout';
                            return response;
                        }
                        var identityChanged = false;
                        var newToken = response.headers.get('authtoken-refresh');
                        if (newToken) {
                            if (IdentityService_1._identity) {
                                IdentityService_1._identity.token = newToken;
                                identityChanged = true;
                            }
                        }
                        return response;
                    }
                });
            });
        };
        IdentityService.prototype.changePassword = function () {
        };
        var IdentityService_1;
        IdentityService.isLoggingOut = false;
        IdentityService = IdentityService_1 = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_framework_1.Aurelia, aurelia_fetch_client_1.HttpClient])
        ], IdentityService);
        return IdentityService;
    }());
    exports.IdentityService = IdentityService;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('services/pdfService',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PdfService = (function () {
        function PdfService() {
        }
        PdfService.runScript = function () {
        };
        PdfService = __decorate([
            aurelia_framework_1.autoinject
        ], PdfService);
        return PdfService;
    }());
    exports.PdfService = PdfService;
});



define('services/customValidationRenderer',["require", "exports", "jquery"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CustomValidationRenderer = (function () {
        function CustomValidationRenderer() {
        }
        CustomValidationRenderer.prototype.render = function (instruction) {
            for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
                var _b = _a[_i], result = _b.result, elements = _b.elements;
                for (var _c = 0, elements_1 = elements; _c < elements_1.length; _c++) {
                    var element = elements_1[_c];
                    this.remove(element, result);
                }
            }
            for (var _d = 0, _e = instruction.render; _d < _e.length; _d++) {
                var _f = _e[_d], result = _f.result, elements = _f.elements;
                for (var _g = 0, elements_2 = elements; _g < elements_2.length; _g++) {
                    var element = elements_2[_g];
                    this.add(element, result);
                }
            }
        };
        CustomValidationRenderer.prototype.add = function (element, result) {
            if (result.valid) {
                return;
            }
            $(element).addClass('border-danger');
        };
        CustomValidationRenderer.prototype.remove = function (element, result) {
            if (result.valid) {
                return;
            }
            $(element).removeClass('border-danger');
        };
        return CustomValidationRenderer;
    }());
    exports.CustomValidationRenderer = CustomValidationRenderer;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/consultaCEPService',["require", "exports", "aurelia-framework", "aurelia-fetch-client"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConsultaCEPService = (function () {
        function ConsultaCEPService(httpClient) {
            this.httpClient = httpClient;
        }
        ConsultaCEPService.prototype.findCEP = function (cep) {
            var url = 'https://viacep.com.br/ws/' + cep + '/json';
            this.httpClient.configure(function (config) { return config.withBaseUrl(url); });
            return this.httpClient
                .fetch(url)
                .then(function (result) {
                return result.json();
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        ConsultaCEPService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
        ], ConsultaCEPService);
        return ConsultaCEPService;
    }());
    exports.ConsultaCEPService = ConsultaCEPService;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('repositories/analytics/analyticsRepository',["require", "exports", "aurelia-framework", "aurelia-api"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AnalyticsRepository = (function () {
        function AnalyticsRepository(config) {
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        AnalyticsRepository.prototype.getNumberOfCustomers = function () {
            return this.api
                .find('analytics/supplier/numberOfCustomers')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        AnalyticsRepository.prototype.getNumberOfOrders = function () {
            return this.api
                .find('analytics/supplier/numberOfOrders')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        AnalyticsRepository.prototype.getOrdersValues = function (period) {
            return this.api
                .find('analytics/supplier/ordersValues?period=' + period)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        AnalyticsRepository.prototype.getMainClients = function (period) {
            return this.api
                .find('analytics/supplier/clients?period=' + period)
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        AnalyticsRepository.prototype.getMainProducts = function () {
            return this.api
                .find('analytics/supplier/products')
                .then(function (result) {
                return result;
            })
                .catch(function (e) {
                console.log(e);
                return Promise.resolve(e.json().then(function (error) {
                    throw error;
                }));
            });
        };
        AnalyticsRepository = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_api_1.Config])
        ], AnalyticsRepository);
        return AnalyticsRepository;
    }());
    exports.AnalyticsRepository = AnalyticsRepository;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/cotacao/pedidosFornecedor',["require", "exports", "../../services/notificationService", "../../services/identityService", "aurelia-framework", "aurelia-router", "aurelia-api", "../../repositories/orderRepository", "aurelia-event-aggregator", "aurelia-dialog", "../components/partials/aceitePedido", "../../domain/orderStatus", "../components/partials/rejeicaoPedido"], function (require, exports, notificationService_1, identityService_1, aurelia_framework_1, aurelia_router_1, aurelia_api_1, orderRepository_1, aurelia_event_aggregator_1, aurelia_dialog_1, aceitePedido_1, orderStatus_1, rejeicaoPedido_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PedidosFornecedor = (function () {
        function PedidosFornecedor(router, dialogService, config, ea, service, nService, orderRepo) {
            this.router = router;
            this.dialogService = dialogService;
            this.config = config;
            this.ea = ea;
            this.service = service;
            this.nService = nService;
            this.orderRepo = orderRepo;
            this.selectedStatus = 0;
        }
        PedidosFornecedor.prototype.attached = function () {
            var _this = this;
            this.ea.publish('loadingData');
            this.ea.subscribe('newOrder', function (data) {
                if (_this.selectedStatus == 0 || _this.selectedStatus.toString() == "0") {
                    _this.orders.push(data);
                }
            });
            this.ea.subscribe('orderFinished', function (data) {
                _this.orders.forEach(function (x) {
                    if (x.id == data.id) {
                        x = data;
                    }
                });
                _this.filteredOrders.forEach(function (x) {
                    if (x.id == data.id) {
                        x.status = data.status;
                    }
                });
            });
            this.loadData();
        };
        PedidosFornecedor.prototype.loadData = function () {
            this.load();
        };
        PedidosFornecedor.prototype.load = function () {
            var _this = this;
            if (this.selectedStatus == orderStatus_1.OrderStatus.Created || this.selectedStatus == null) {
                this.orderRepo
                    .getMyNewOrders()
                    .then(function (x) {
                    _this.orders = x;
                    _this.filteredOrders = _this.orders;
                    _this.filter = '';
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
            else if (this.selectedStatus == orderStatus_1.OrderStatus.Accepted) {
                this.orderRepo
                    .getMyAcceptedOrders()
                    .then(function (x) {
                    _this.orders = x;
                    _this.filteredOrders = _this.orders;
                    _this.filter = '';
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
            else if (this.selectedStatus == orderStatus_1.OrderStatus.Rejected) {
                this.orderRepo
                    .getMyRejectedOrders()
                    .then(function (x) {
                    _this.orders = x;
                    _this.filteredOrders = _this.orders;
                    _this.filter = '';
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
            else if (this.selectedStatus == orderStatus_1.OrderStatus.Delivered) {
                this.orderRepo
                    .getMyDeliveredOrders()
                    .then(function (x) {
                    _this.orders = x;
                    _this.filteredOrders = _this.orders;
                    _this.filter = '';
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
        };
        PedidosFornecedor.prototype.selectOrder = function (order) {
            this.selectedOrder = order;
            this.foodService = order.foodService;
            this.showdDetails = true;
        };
        PedidosFornecedor.prototype.showOrders = function () {
            this.showdDetails = false;
        };
        PedidosFornecedor.prototype.acceptOrder = function (order) {
            var params = { Order: order };
            this.dialogService
                .open({ viewModel: aceitePedido_1.AceitePedido, model: params, lock: false })
                .whenClosed(function (response) {
                if (response.wasCancelled) {
                    return;
                }
                order.status = orderStatus_1.OrderStatus.Accepted;
            });
        };
        PedidosFornecedor.prototype.rejectOrder = function (order) {
            var params = { Order: order };
            this.dialogService
                .open({ viewModel: rejeicaoPedido_1.RejeicaoPedido, model: params, lock: false })
                .whenClosed(function (response) {
                if (response.wasCancelled) {
                    return;
                }
                order.status = orderStatus_1.OrderStatus.Rejected;
            });
        };
        PedidosFornecedor.prototype.search = function () {
            var _this = this;
            this.isFiltered = true;
            this.filteredOrders = this.orders.filter(function (x) {
                var isFound = true;
                if ((_this.filter != null && _this.filter != '')) {
                    if ((x.code.toString().toUpperCase().includes(_this.filter.toUpperCase()))
                        || (x.foodService.name.toString().toUpperCase().includes(_this.filter.toUpperCase()))
                        || (x.createdBy.name.toString().toUpperCase().includes(_this.filter.toUpperCase()))
                        || (x.total.toString().toUpperCase().includes(_this.filter.toUpperCase()))) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if (isFound) {
                    return x;
                }
            });
        };
        PedidosFornecedor.prototype.exportOrder = function (order) {
            var api = this.config.getEndpoint('csz');
            window.open(api.client.baseUrl + 'ExportOrderToExcel?orderId=' + order.id, '_parent');
        };
        PedidosFornecedor = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_dialog_1.DialogService,
                aurelia_api_1.Config,
                aurelia_event_aggregator_1.EventAggregator,
                identityService_1.IdentityService,
                notificationService_1.NotificationService,
                orderRepository_1.OrderRepository])
        ], PedidosFornecedor);
        return PedidosFornecedor;
    }());
    exports.PedidosFornecedor = PedidosFornecedor;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/cotacao/cotacao',["require", "exports", "../../services/notificationService", "aurelia-framework", "aurelia-router", "../../repositories/foodServiceRepository", "../../repositories/simulationRepository", "../../domain/simulationInput", "../../domain/simulationInputItem", "../../repositories/orderRepository", "aurelia-event-aggregator", "aurelia-dialog", "aurelia-validation", "../formValidationRenderer", "../../repositories/deliveryRuleRepository", "../../domain/deliveryRule", "../../domain/checkDeliveryViewModel", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, notificationService_1, aurelia_framework_1, aurelia_router_1, foodServiceRepository_1, simulationRepository_1, simulationInput_1, simulationInputItem_1, orderRepository_1, aurelia_event_aggregator_1, aurelia_dialog_1, aurelia_validation_1, formValidationRenderer_1, deliveryRuleRepository_1, deliveryRule_1, checkDeliveryViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Pedido = (function () {
        function Pedido(router, repository, ea, dialogService, simulationRepository, orderRepository, nService, deliveryRepository, validationControllerFactory) {
            this.router = router;
            this.repository = repository;
            this.ea = ea;
            this.dialogService = dialogService;
            this.simulationRepository = simulationRepository;
            this.orderRepository = orderRepository;
            this.nService = nService;
            this.deliveryRepository = deliveryRepository;
            this.validationControllerFactory = validationControllerFactory;
            this.currentStep = 1;
            this.totalSteps = 3;
            this.isProcessing = false;
            this.orderWasGenerated = false;
            this.input = new simulationInput_1.SimulationInput();
            this.supplierBlackList = [];
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new formValidationRenderer_1.FormValidationRenderer());
            this.validationController.validateTrigger = aurelia_validation_1.validateTrigger.blur;
            this.deliveryWasChecked = false;
            this.viewModel = new checkDeliveryViewModel_1.CheckDeliveryViewModel();
            this.isOrderValid = true;
        }
        Pedido.prototype.runScript = function () {
            var thisForm = '#rootwizard-1';
            var outher = this;
            if ($(thisForm).length) {
                $('.pager li a, .pager li span').on('click', function (e) {
                    e.preventDefault();
                });
                var wizardStagesTotal = $(thisForm + ' .tab-pane').length;
                $(thisForm).bootstrapWizard({ onNext: function (tab, navigation, index) {
                        if (index <= wizardStagesTotal) {
                            $(thisForm + ' .tab-pane').eq(index).addClass('active');
                            $(thisForm + ' .tab-pane').eq(index - 1).removeClass('active');
                        }
                    }, onPrevious: function (tab, navigation, index) {
                        if (index !== -1) {
                            $(thisForm + ' .tab-pane').eq(index).addClass('active');
                            $(thisForm + ' .tab-pane').eq(index + 1).removeClass('active');
                        }
                    }, onTabShow: function (tab, navigation, index) {
                        var total = navigation.find('li').length;
                        var current = index + 1;
                        var completionPercentage = (current / total) * 100;
                        var progressBar = $(thisForm).closest('.card').find(".card-header .progress-bar");
                        progressBar.css({ "width": completionPercentage + "%" }).attr("aria-valuenow", completionPercentage);
                    }, onTabClick: function (tab, navigation, index) {
                        return false;
                    } });
            }
        };
        Pedido.prototype.activate = function (params) {
            if (params.orderId != null && params.orderId != '') {
                this.orderId = params.orderId;
            }
        };
        Pedido.prototype.advance = function () {
            this.currentStep++;
            if (this.currentStep == 2) {
                this.simulate();
            }
            if (this.currentStep == 3) {
                window.scrollTo(0, 0);
            }
        };
        Pedido.prototype.simulate = function () {
            var _this = this;
            this.ea.publish('loadingData');
            this.isProcessing = true;
            this.input.buyListId = this.selectedQuote.id;
            this.input.items = [];
            this.selectedQuote.products.forEach(function (x) {
                if (x.quantity != null && x.quantity != 0) {
                    var item = new simulationInputItem_1.SimulationInputItem();
                    item.productId = x.id;
                    item.quantity = x.quantity;
                    _this.input.items.push(item);
                }
            });
            this.input.supplierBlackList = this.supplierBlackList;
            this.simulationRepository
                .simulate(this.input)
                .then(function (x) {
                _this.simulation = x;
                _this.isProcessing = false;
                _this.runScript();
                _this.ea.publish('dataLoaded');
            })
                .catch(function (e) {
                _this.nService.presentError(e);
                _this.isProcessing = false;
                _this.ea.publish('dataLoaded');
            });
        };
        Pedido.prototype.back = function () {
            this.currentStep--;
        };
        Pedido.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.runScript();
            this.loadData();
        };
        Pedido.prototype.addRemoveSupplier = function (supplier) {
            if (supplier.wasRemoved && !supplier.isInvalid) {
                this.selectedQuote.suppliers.forEach(function (x) {
                    if (x.id == supplier.id) {
                        x.isInvalid = false;
                        x.wasRemoved = false;
                    }
                });
                this.selectedQuote.products.forEach(function (x) {
                    x.suppliers.forEach(function (y) {
                        if (y.id == supplier.id) {
                            y.isInvalid = false;
                            y.wasRemoved = false;
                        }
                    });
                });
                this.supplierBlackList = this.supplierBlackList.filter(function (x) { return x.id != supplier.id; });
            }
            else if (!supplier.isInvalid) {
                this.selectedQuote.suppliers.forEach(function (x) {
                    if (x.id == supplier.id) {
                        x.isInvalid = false;
                        x.wasRemoved = true;
                    }
                });
                this.selectedQuote.products.forEach(function (x) {
                    x.suppliers.forEach(function (y) {
                        if (y.id == supplier.id) {
                            y.isInvalid = false;
                            y.wasRemoved = true;
                        }
                    });
                });
                this.supplierBlackList.push(supplier);
            }
            this.checkIfOrderIsvalid();
        };
        Pedido.prototype.loadData = function () {
            var _this = this;
            if (this.orderId != null && this.orderId != '') {
                this.simulationRepository
                    .getCotacaoFromOrder(this.orderId)
                    .then(function (x) {
                    _this.selectedQuote = x;
                    if (x.blackListSupplier != null) {
                        _this.addRemoveSupplier(x.blackListSupplier);
                    }
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) { return _this.nService.presentError(e); });
                this.loadDeliveryRule();
            }
            else {
                this.repository
                    .getBuyListsParaCotacao()
                    .then(function (x) {
                    _this.quotes = x;
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) { return _this.nService.presentError(e); });
            }
        };
        Pedido.prototype.loadDeliveryRule = function () {
            var _this = this;
            this.deliveryRepository
                .getRule(this.selectedQuote.productClass.id)
                .then(function (x) {
                if (x != null) {
                    _this.deliveryRule = x;
                    _this.viewModel.deliveryScheduleStart = x.deliveryScheduleInitial;
                    _this.viewModel.deliveryScheduleEnd = x.deliveryScheduleFinal;
                    _this.viewModel.deliveryDate = deliveryRule_1.DeliveryRule.getNextDeliveryDate(_this.deliveryRule);
                    _this.checkDeliveryDate();
                }
            })
                .catch(function (e) { return _this.nService.presentError(e); });
        };
        Pedido.prototype.checkDeliveryDate = function () {
            var _this = this;
            this.deliveryWasChecked = false;
            this.viewModel.suppliers = [];
            this.selectedQuote.suppliers.forEach(function (x) {
                _this.viewModel.suppliers.push(x.id);
            });
            if (this.viewModel.deliveryDate < new Date()) {
                this.nService.presentError('A data de entrega deve ser maior ou igual a hoje');
                this.isOrderValid = false;
            }
            if (this.viewModel.deliveryScheduleStart >= this.viewModel.deliveryScheduleEnd) {
                this.nService.presentError('O horário inicial deve ser maior que o horário final');
                this.isOrderValid = false;
            }
            this.deliveryRepository
                .checkDeliveryRule(this.viewModel)
                .then(function (x) {
                _this.checkDeliveryResult = x;
                x.items.forEach(function (item) {
                    _this.selectedQuote.suppliers.forEach(function (y) {
                        if (y.id == item.supplierId) {
                            if (!item.isValid) {
                                y.isInvalid = true;
                                _this.supplierBlackList.push(y);
                            }
                            else {
                                y.isInvalid = false;
                                _this.supplierBlackList = _this.supplierBlackList.filter(function (x) { return x.id != y.id; });
                            }
                        }
                    });
                    _this.selectedQuote.products.forEach(function (x) {
                        x.suppliers.forEach(function (y) {
                            if (y.id == item.supplierId) {
                                if (!item.isValid) {
                                    y.isInvalid = true;
                                }
                                else {
                                    y.isInvalid = false;
                                }
                            }
                        });
                    });
                });
                _this.deliveryWasChecked = true;
                _this.checkIfOrderIsvalid();
            })
                .catch(function (e) { return _this.nService.presentError(e); });
        };
        Pedido.prototype.checkIfOrderIsvalid = function () {
            var isValid = true;
            if (this.viewModel.deliveryDate < new Date()) {
                isValid = false;
            }
            if (this.viewModel.deliveryScheduleStart >= this.viewModel.deliveryScheduleEnd) {
                isValid = false;
            }
            if (this.supplierBlackList.length == this.selectedQuote.suppliers.length) {
                isValid = false;
            }
            if (isValid) {
                this.isOrderValid = true;
            }
            else {
                this.isOrderValid = false;
            }
        };
        Pedido.prototype.generateOrder = function () {
            var _this = this;
            var params = { Quote: this.selectedQuote };
            this.isProcessing = true;
            this.selectedResult.deliveryScheduleStart = this.viewModel.deliveryScheduleStart;
            this.selectedResult.deliveryScheduleEnd = this.viewModel.deliveryScheduleEnd;
            this.selectedResult.deliveryDate = this.viewModel.deliveryDate;
            this.orderRepository
                .createOrder(this.selectedResult)
                .then(function (result) {
                _this.nService.success('Pedido realizado!');
                _this.router.navigateToRoute('pedidosFoodService');
                _this.isProcessing = false;
                _this.orderWasGenerated = true;
            }).catch(function (e) {
                _this.isProcessing = false;
                _this.nService.error(e);
            });
        };
        Pedido.prototype.changeSelectedCotacao = function (result) {
            this.simulation.betterResults.forEach(function (x) { return x != result ? x.isSelected = false : x.isSelected = true; });
            this.selectedResult = result;
        };
        Pedido = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                foodServiceRepository_1.FoodServiceRepository,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService,
                simulationRepository_1.SimulationRepository,
                orderRepository_1.OrderRepository,
                notificationService_1.NotificationService,
                deliveryRuleRepository_1.DeliveryRuleRepository,
                aurelia_validation_1.ValidationControllerFactory])
        ], Pedido);
        return Pedido;
    }());
    exports.Pedido = Pedido;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/foodService/meusProdutos',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MeusProdutos = (function () {
        function MeusProdutos(router, ea) {
            this.router = router;
            this.ea = ea;
            this.productAddedCount = 0;
        }
        MeusProdutos.prototype.attached = function () {
            var _this = this;
            this.ea.publish('loadingData');
            this.ea.subscribe('productAdded', function (product) {
                _this.productAddedCount++;
            });
            this.ea.subscribe('productRemoved', function (product) {
                _this.productAddedCount--;
            });
        };
        MeusProdutos.prototype.loadData = function () {
        };
        MeusProdutos = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator])
        ], MeusProdutos);
        return MeusProdutos;
    }());
    exports.MeusProdutos = MeusProdutos;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/foodService/pedidosFoodService',["require", "exports", "../../services/notificationService", "../../services/identityService", "aurelia-framework", "aurelia-router", "aurelia-api", "../../repositories/orderRepository", "aurelia-event-aggregator", "aurelia-dialog", "../../domain/orderStatus", "../components/partials/baixaPedido"], function (require, exports, notificationService_1, identityService_1, aurelia_framework_1, aurelia_router_1, aurelia_api_1, orderRepository_1, aurelia_event_aggregator_1, aurelia_dialog_1, orderStatus_1, baixaPedido_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PedidosFoodService = (function () {
        function PedidosFoodService(router, dialogService, ea, config, service, nService, orderRepo) {
            this.router = router;
            this.dialogService = dialogService;
            this.ea = ea;
            this.config = config;
            this.service = service;
            this.nService = nService;
            this.orderRepo = orderRepo;
        }
        PedidosFoodService.prototype.attached = function () {
            var _this = this;
            this.ea.publish('loadingData');
            this.ea.subscribe('orderAccepted', function (data) {
                _this.orders.forEach(function (x) {
                    if (x.id == data.id) {
                        x = data;
                    }
                });
                _this.filteredOrders.forEach(function (x) {
                    if (x.id == data.id) {
                        x.status = data.status;
                        x.deliveryDate = data.deliveryDate;
                        x.paymentDate = data.paymentDate;
                    }
                });
            });
            this.ea.subscribe('orderRejected', function (data) {
                var isFound = false;
                _this.orders.forEach(function (x) {
                    if (x.id == data.id) {
                        x.status = data.status;
                        x.reasonToReject = data.reasonToReject;
                        isFound = true;
                    }
                });
                if (!isFound && (_this.selectedStatus == 3 || _this.selectedStatus.toString() == "3")) {
                    _this.orders.push(data);
                }
            });
            this.loadData();
        };
        PedidosFoodService.prototype.loadData = function () {
            this.load();
        };
        PedidosFoodService.prototype.selectOrder = function (order) {
            this.selectedOrder = order;
            this.showdDetails = true;
        };
        PedidosFoodService.prototype.showOrders = function () {
            this.showdDetails = false;
        };
        PedidosFoodService.prototype.load = function () {
            var _this = this;
            if (this.selectedStatus == orderStatus_1.OrderStatus.Created || this.selectedStatus == null) {
                this.orderRepo
                    .getMyNewOrders()
                    .then(function (x) {
                    _this.orders = x;
                    _this.filteredOrders = _this.orders;
                    _this.filter = '';
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) {
                    _this.ea.publish('dataLoaded');
                    _this.nService.presentError(e);
                });
            }
            else if (this.selectedStatus == orderStatus_1.OrderStatus.Accepted) {
                this.orderRepo
                    .getMyAcceptedOrders()
                    .then(function (x) {
                    _this.orders = x;
                    _this.filteredOrders = _this.orders;
                    _this.filter = '';
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) {
                    _this.ea.publish('dataLoaded');
                    _this.nService.presentError(e);
                });
            }
            else if (this.selectedStatus == orderStatus_1.OrderStatus.Rejected) {
                this.orderRepo
                    .getMyRejectedOrders()
                    .then(function (x) {
                    _this.orders = x;
                    _this.filteredOrders = _this.orders;
                    _this.filter = '';
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) {
                    _this.ea.publish('dataLoaded');
                    _this.nService.presentError(e);
                });
            }
            else if (this.selectedStatus == orderStatus_1.OrderStatus.Delivered) {
                this.orderRepo
                    .getMyDeliveredOrders()
                    .then(function (x) {
                    _this.orders = x;
                    _this.filteredOrders = _this.orders;
                    _this.filter = '';
                })
                    .then(function () { return _this.ea.publish('dataLoaded'); })
                    .catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
        };
        PedidosFoodService.prototype.quoteAgain = function (order) {
            this.router.navigate('cotacao?orderId=' + order.id);
        };
        PedidosFoodService.prototype.deliverOrder = function (order) {
            var params = { Order: order };
            this.dialogService
                .open({ viewModel: baixaPedido_1.BaixaPedido, model: params, lock: false })
                .whenClosed(function (response) {
                if (response.wasCancelled) {
                    return;
                }
                order.status = orderStatus_1.OrderStatus.Delivered;
            });
        };
        PedidosFoodService.prototype.search = function () {
            var _this = this;
            this.isFiltered = true;
            this.filteredOrders = this.orders.filter(function (x) {
                var isFound = true;
                if ((_this.filter != null && _this.filter != '')) {
                    if ((x.code.toString().toUpperCase().includes(_this.filter.toUpperCase()))
                        || (x.foodService.name.toString().toUpperCase().includes(_this.filter.toUpperCase()))
                        || (x.createdBy.name.toString().toUpperCase().includes(_this.filter.toUpperCase()))
                        || (x.total.toString().toUpperCase().includes(_this.filter.toUpperCase()))) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if (isFound) {
                    return x;
                }
            });
        };
        PedidosFoodService.prototype.exportOrder = function (order) {
            var api = this.config.getEndpoint('csz');
            window.open(api.client.baseUrl + 'ExportOrderToExcel?orderId=' + order.id, '_parent');
        };
        PedidosFoodService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_dialog_1.DialogService,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_api_1.Config,
                identityService_1.IdentityService,
                notificationService_1.NotificationService,
                orderRepository_1.OrderRepository])
        ], PedidosFoodService);
        return PedidosFoodService;
    }());
    exports.PedidosFoodService = PedidosFoodService;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/foodService/dashboard',["require", "exports", "aurelia-framework", "aurelia-api", "jquery", "popper.js", "bootstrap", "mdbootstrap", "velocity-animate", "velocity", "custom-scrollbar", "jquery-visible", "ie10-viewport"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(aurelia, config) {
            this.aurelia = aurelia;
            this.config = config;
        }
        App.prototype.attached = function () {
        };
        App = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_framework_1.Aurelia, aurelia_api_1.Config])
        ], App);
        return App;
    }());
    exports.App = App;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/foodService/regraDeEntrega',["require", "exports", "../../services/notificationService", "../../services/identityService", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../repositories/productRepository", "../../domain/deliveryRule", "../../repositories/deliveryRuleRepository", "jquery-mask-plugin"], function (require, exports, notificationService_1, identityService_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, productRepository_1, deliveryRule_1, deliveryRuleRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RegraDeEntrega = (function () {
        function RegraDeEntrega(router, service, ea, nService, productRepository, deliveryRepository) {
            this.router = router;
            this.service = service;
            this.ea = ea;
            this.nService = nService;
            this.productRepository = productRepository;
            this.deliveryRepository = deliveryRepository;
            this.isLoading = false;
        }
        RegraDeEntrega.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.loadData();
        };
        RegraDeEntrega.prototype.loadData = function () {
            var _this = this;
            var identity = this.service.getIdentity();
            this.productRepository
                .getAllClasses()
                .then(function (classes) {
                _this.productClasses = classes;
            })
                .then(function () { return _this.ea.publish('dataLoaded'); })
                .catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        RegraDeEntrega.prototype.loadRule = function () {
            var _this = this;
            debugger;
            this.deliveryRepository
                .getRule(this.selectedClass.id)
                .then(function (x) {
                if (x == null) {
                    _this.rule = new deliveryRule_1.DeliveryRule();
                    _this.rule.productClass = _this.selectedClass;
                }
                else {
                    _this.rule = x;
                }
            })
                .catch(function (e) { return _this.nService.presentError(e); });
        };
        RegraDeEntrega.prototype.save = function () {
            var _this = this;
            this.isLoading = true;
            this.deliveryRepository
                .save(this.rule)
                .then(function (result) {
                _this.rule = result;
                _this.nService.success('Regra salva com sucesso!');
                _this.isLoading = false;
            }).catch(function (e) {
                _this.nService.error(e);
                _this.isLoading = false;
            });
        };
        RegraDeEntrega = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                identityService_1.IdentityService,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                productRepository_1.ProductRepository,
                deliveryRuleRepository_1.DeliveryRuleRepository])
        ], RegraDeEntrega);
        return RegraDeEntrega;
    }());
    exports.RegraDeEntrega = RegraDeEntrega;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/foodService/evaluations',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../services/notificationService", "../../repositories/evaluationRepository", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, notificationService_1, evaluationRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Evaluations = (function () {
        function Evaluations(router, ea, repository, nService) {
            this.router = router;
            this.ea = ea;
            this.repository = repository;
            this.nService = nService;
        }
        Evaluations.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.selectedStatus = 0;
            this.loadData();
        };
        Evaluations.prototype.loadData = function () {
            this.load();
        };
        Evaluations.prototype.load = function () {
            var _this = this;
            this.repository
                .getMyEvaluations()
                .then(function (x) {
                _this.evaluations = x;
                _this.filteredEvaluations = x;
                _this.ea.publish('dataLoaded');
            })
                .catch(function (e) {
                _this.ea.publish('dataLoaded');
                _this.nService.presentError(e);
            });
        };
        Evaluations.prototype.showDetails = function (evaluation) {
            this.evaluation = evaluation;
        };
        Evaluations = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                evaluationRepository_1.EvaluationRepository,
                notificationService_1.NotificationService])
        ], Evaluations);
        return Evaluations;
    }());
    exports.Evaluations = Evaluations;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/foodService/fornecedores',["require", "exports", "../../services/notificationService", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../repositories/supplierConnectionRepository", "../../repositories/productRepository", "../../domain/blockSupplierConnectionViewModel"], function (require, exports, notificationService_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, supplierConnectionRepository_1, productRepository_1, blockSupplierConnectionViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Fornecedores = (function () {
        function Fornecedores(router, repository, productRepository, nService, ea) {
            var _this = this;
            this.router = router;
            this.repository = repository;
            this.productRepository = productRepository;
            this.nService = nService;
            this.ea = ea;
            this.tipoFiltro = '2';
            this.ea.subscribe('waitingToApprove', function (conn) {
                _this.suppliers.forEach(function (x) {
                    if (x.supplier.id == conn.supplierId) {
                        x.status = conn.status;
                    }
                });
            });
            this.ea.subscribe('registrationApproved', function (conn) {
                _this.suppliers.forEach(function (x) {
                    if (x.supplier.id == conn.supplierId) {
                        x.status = conn.status;
                    }
                });
            });
            this.ea.subscribe('registrationRejected', function (conn) {
                _this.suppliers.forEach(function (x) {
                    if (x.supplier.id == conn.supplierId) {
                        x.status = conn.status;
                    }
                });
            });
            this.ea.subscribe('clientBlocked', function (conn) {
                _this.suppliers.forEach(function (x) {
                    if (x.supplier.id == conn.supplierId) {
                        x.status = conn.status;
                    }
                });
            });
            this.ea.subscribe('waitingToApprove', function (conn) {
                _this.suppliers.forEach(function (x) {
                    if (x.supplier.id == conn.supplierId) {
                        x.status = conn.status;
                    }
                });
            });
            this.ea.subscribe('showSupplierDetailsCanceled', function () {
                _this.showDetails = false;
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            });
            this.showDetails = false;
        }
        Fornecedores.prototype.attached = function () {
            var _this = this;
            this.ea.publish('loadingData');
            this.loadData();
            this.alterView()
                .then(function () {
                _this.ea.publish('dataLoaded');
                _this.isLoading = false;
            });
            ;
        };
        Fornecedores.prototype.loadData = function () {
            this.isLoading = true;
        };
        Fornecedores.prototype.alterView = function () {
            this.filteredSuppliers = [];
            this.suppliers = [];
            var type = Number.parseInt(this.tipoFiltro);
            if (type == 1) {
                this.title = 'Fornecedores Sugeridos';
                return this.loadSuggestedSuppliers();
            }
            else if (type == 2) {
                this.title = 'Meus fornecedores';
                return this.loadMySuppliers();
            }
            else if (type == 3) {
                this.title = 'Todos fornecedores';
                return this.loadAllSuppliers();
            }
            else if (type == 4) {
                this.title = 'Todos fornecedores';
                return this.loadBlockedSuppliers();
            }
        };
        Fornecedores.prototype.loadSuggestedSuppliers = function () {
            var _this = this;
            return this.repository
                .getSuggestedSuppliers()
                .then(function (data) {
                _this.suppliers = data;
                _this.search();
            });
        };
        Fornecedores.prototype.loadMySuppliers = function () {
            var _this = this;
            return this.repository
                .getMySuppliers()
                .then(function (data) {
                _this.suppliers = data;
                _this.filteredSuppliers = data;
            });
        };
        Fornecedores.prototype.loadBlockedSuppliers = function () {
            var _this = this;
            return this.repository
                .getMyBlockedSuppliers()
                .then(function (data) {
                _this.suppliers = data;
                _this.filteredSuppliers = data;
            });
        };
        Fornecedores.prototype.loadAllSuppliers = function () {
            var _this = this;
            return this.repository
                .getAllSuppliers()
                .then(function (data) {
                _this.suppliers = data;
                _this.filteredSuppliers = data;
            });
        };
        Fornecedores.prototype.connect = function (viewModel) {
            var _this = this;
            viewModel.isLoading = true;
            this.repository
                .connect(viewModel.supplier)
                .then(function (connection) {
                viewModel.status = 1;
                _this.nService.presentSuccess('A solicitação de conexão foi realizada com sucesso!');
                viewModel.isLoading = false;
            })
                .catch(function (e) {
                _this.nService.presentError(e);
                viewModel.isLoading = false;
            });
        };
        Fornecedores.prototype.block = function (viewModel) {
            var _this = this;
            viewModel.isLoading = true;
            var vm = new blockSupplierConnectionViewModel_1.BlockSupplierConnectionViewModel();
            vm.supplierId = viewModel.supplier.id;
            this.repository
                .block(vm)
                .then(function (data) {
                viewModel.isLoading = false;
                viewModel.status = 6;
                _this.nService.presentSuccess('Fornecedor bloqueado com sucesso!');
            }).catch(function (e) {
                _this.nService.presentError(e);
                viewModel.isLoading = false;
            });
        };
        Fornecedores.prototype.unblock = function (viewModel) {
            var _this = this;
            viewModel.isLoading = true;
            var vm = new blockSupplierConnectionViewModel_1.BlockSupplierConnectionViewModel();
            vm.supplierId = viewModel.supplier.id;
            this.repository
                .unblock(vm)
                .then(function (data) {
                viewModel.isLoading = false;
                viewModel.status = 2;
                _this.nService.presentSuccess('Fornecedor desbloqueado com sucesso!');
            }).catch(function (e) {
                _this.nService.presentError(e);
                viewModel.isLoading = false;
            });
        };
        Fornecedores.prototype.search = function () {
            var _this = this;
            this.filteredSuppliers =
                this.suppliers.filter(function (x) {
                    var isFound = true;
                    if ((_this.filter != null && _this.filter != '')) {
                        if (x.supplier.name.toUpperCase().includes(_this.filter.toUpperCase())) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return isFound;
                    }
                });
        };
        Fornecedores.prototype.showSupplierDetails = function (x) {
            this.showDetails = true;
            this.ea.publish('showSupplierDetails', { supplierId: x.supplier.id, edit: false });
        };
        Fornecedores = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                supplierConnectionRepository_1.SupplierConnectionRepository,
                productRepository_1.ProductRepository,
                notificationService_1.NotificationService,
                aurelia_event_aggregator_1.EventAggregator])
        ], Fornecedores);
        return Fornecedores;
    }());
    exports.Fornecedores = Fornecedores;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/foodService/cadastro',["require", "exports", "../../validators/foodServiceValidator", "../../services/consultaCEPService", "../../repositories/stateRegistrationRepository", "../../domain/stateRegistration", "../../services/notificationService", "../../repositories/foodServiceRepository", "../../services/identityService", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../domain/address", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, foodServiceValidator_1, consultaCEPService_1, stateRegistrationRepository_1, stateRegistration_1, notificationService_1, foodServiceRepository_1, identityService_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, address_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cadastro = (function () {
        function Cadastro(router, repository, service, ea, nService, stateRepo, consultaCepService) {
            this.router = router;
            this.repository = repository;
            this.service = service;
            this.ea = ea;
            this.nService = nService;
            this.stateRepo = stateRepo;
            this.consultaCepService = consultaCepService;
            this.currentStep = 1;
            this.totalSteps = 3;
            this.isLoading = false;
        }
        Cadastro.prototype.runScript = function () {
            var thisForm = '#rootwizard-1';
            var outher = this;
            if ($(thisForm).length) {
                $('.pager li a, .pager li span').on('click', function (e) {
                    e.preventDefault();
                });
                var wizardStagesTotal = $(thisForm + ' .tab-pane').length;
                $(thisForm).bootstrapWizard({ onNext: function (tab, navigation, index) {
                        if (index <= wizardStagesTotal) {
                            $(thisForm + ' .tab-pane').eq(index).addClass('active');
                            $(thisForm + ' .tab-pane').eq(index - 1).removeClass('active');
                        }
                    }, onPrevious: function (tab, navigation, index) {
                        if (index !== -1) {
                            $(thisForm + ' .tab-pane').eq(index).addClass('active');
                            $(thisForm + ' .tab-pane').eq(index + 1).removeClass('active');
                        }
                    }, onTabShow: function (tab, navigation, index) {
                        var total = navigation.find('li').length;
                        var current = index + 1;
                        var completionPercentage = (current / total) * 100;
                        var progressBar = $(thisForm).closest('.card').find(".card-header .progress-bar");
                        progressBar.css({ "width": completionPercentage + "%" }).attr("aria-valuenow", completionPercentage);
                    }, onTabClick: function (tab, navigation, index) {
                        return false;
                    } });
            }
        };
        Cadastro.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.runScript();
            this.loadData();
        };
        Cadastro.prototype.loadData = function () {
            var _this = this;
            var identity = this.service.getIdentity();
            var promisse0 = this.repository
                .getByUser(identity.id)
                .then(function (foodService) {
                _this.foodService = foodService;
                if (_this.foodService.address == null) {
                    _this.foodService.address = new address_1.Address();
                }
                if (_this.foodService.stateRegistration == null) {
                    _this.foodService.stateRegistration = new stateRegistration_1.StateRegistration();
                }
                _this.validator = new foodServiceValidator_1.FoodServiceValidator(_this.foodService);
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            var promisse1 = this.stateRepo
                .getAll()
                .then(function (data) {
                _this.stateRegistrations = data;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            Promise.all([promisse0, promisse1]).then(function () { return _this.ea.publish('dataLoaded'); });
        };
        Cadastro.prototype.consultaCEP = function () {
            var _this = this;
            this.validator.addressValidator.validateCep();
            if (this.foodService.address.cep.length >= 8) {
                this.consultaCepService
                    .findCEP(this.foodService.address.cep)
                    .then(function (result) {
                    if (result != null) {
                        _this.foodService.address.city = result.localidade;
                        _this.foodService.address.neighborhood = result.bairro;
                        _this.foodService.address.number = null;
                        _this.foodService.address.logradouro = result.logradouro;
                        _this.foodService.address.complement = result.complemento;
                        _this.foodService.address.state = result.uf;
                        _this.validator.validate();
                    }
                }).catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
        };
        Cadastro.prototype.advance = function () {
            this.currentStep++;
        };
        Cadastro.prototype.back = function () {
            this.currentStep--;
        };
        Cadastro.prototype.save = function () {
            var _this = this;
            this.isLoading = true;
            var errors = this.validator.validate();
            if (errors.length == 0) {
                this.foodService.stateRegistration = this.stateRegistrations.filter(function (x) { return x.id == _this.foodService.stateRegistration.id; })[0];
                this.repository
                    .save(this.foodService)
                    .then(function (identity) {
                    _this.nService.success('Cadastro realizado!');
                    _this.router.navigate('/#/cadastroFoodService');
                    _this.isLoading = false;
                }).catch(function (e) {
                    _this.isLoading = false;
                    _this.nService.error(e);
                });
            }
            else {
                this.isLoading = false;
                errors.forEach(function (error) {
                    _this.nService.error(error);
                });
            }
        };
        Cadastro = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                foodServiceRepository_1.FoodServiceRepository,
                identityService_1.IdentityService,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                stateRegistrationRepository_1.StateRegistrationRepository,
                consultaCEPService_1.ConsultaCEPService])
        ], Cadastro);
        return Cadastro;
    }());
    exports.Cadastro = Cadastro;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/admin/dashboard',["require", "exports", "aurelia-framework", "aurelia-api", "jquery", "popper.js", "bootstrap", "mdbootstrap", "velocity-animate", "velocity", "custom-scrollbar", "jquery-visible", "ie10-viewport"], function (require, exports, aurelia_framework_1, aurelia_api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(aurelia, config) {
            this.aurelia = aurelia;
            this.config = config;
            this.api = this.config.getEndpoint('csz');
        }
        App.prototype.attached = function () {
        };
        App.prototype.exportOrders = function () {
            var api = this.config.getEndpoint('csz');
            window.open(api.client.baseUrl + 'ExportOrders?startDate=' + this.startDate + '&endDate=' + this.endDate, '_parent');
        };
        App = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_framework_1.Aurelia, aurelia_api_1.Config])
        ], App);
        return App;
    }());
    exports.App = App;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/fornecedor/clientes',["require", "exports", "../../services/notificationService", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../repositories/foodServiceConnectionRepository", "../../domain/foodServiceViewModel"], function (require, exports, notificationService_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, foodServiceConnectionRepository_1, foodServiceViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Clientes = (function () {
        function Clientes(router, repository, nService, ea) {
            var _this = this;
            this.router = router;
            this.repository = repository;
            this.nService = nService;
            this.ea = ea;
            this.ea.subscribe('registrationSent', function () {
                _this.loadData();
            });
            this.ea.subscribe('showFoodServiceDetailsCanceled', function () {
                _this.showDetails = false;
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            });
            this.processing = false;
            this.showDetails = false;
        }
        Clientes.prototype.attached = function () {
            var _this = this;
            this.ea.publish('loadingData');
            this.type = 0;
            this.tipoFiltro = '0';
            this.alterView().then(function () { return _this.ea.publish('dataLoaded'); });
        };
        Clientes.prototype.loadData = function () {
            var _this = this;
            this.foodServices = [];
            this.filteredFoodServices = [];
            this.loadSuppliers().then(function () { return _this.ea.publish('dataLoaded'); });
        };
        Clientes.prototype.alterView = function () {
            this.type = Number.parseInt(this.tipoFiltro);
            if (this.type == 0) {
                this.title = 'Novos Clientes';
            }
            else if (this.type == 1) {
                this.title = 'Aguardando Aprovação';
            }
            else if (this.type == 2) {
                this.title = 'Meus  Clientes';
            }
            else if (this.type == 3) {
                this.title = 'Clientes Bloqueados';
            }
            return this.loadSuppliers();
        };
        Clientes.prototype.loadSuppliers = function () {
            var _this = this;
            this.processing = true;
            return this.repository
                .getSuppliers(this.type)
                .then(function (data) {
                _this.foodServices = data;
                _this.search();
                _this.processing = false;
            }).catch(function (e) {
                _this.nService.presentError(e);
                _this.processing = false;
            });
        };
        Clientes.prototype.approve = function (x) {
            var _this = this;
            var viewModel = new foodServiceViewModel_1.FoodServiceConnectionViewModel();
            viewModel.foodService = x.foodService;
            viewModel.status = 2;
            this.repository
                .updateConnection(viewModel)
                .then(function (data) {
                _this.loadData();
                _this.nService.presentSuccess('Cliente foi aprovado com sucesso!');
                _this.ea.publish('foodApproved');
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        Clientes.prototype.registrationSent = function (x) {
            var _this = this;
            x.isLoading = true;
            var viewModel = new foodServiceViewModel_1.FoodServiceConnectionViewModel();
            viewModel.foodService = x.foodService;
            viewModel.status = 5;
            this.repository
                .updateConnection(viewModel)
                .then(function (data) {
                x.isLoading = false;
                _this.loadData();
                _this.nService.presentSuccess('Status atualizado com sucesso!');
                _this.ea.publish('registrationSent');
            }).catch(function (e) {
                _this.nService.presentError(e);
                x.isLoading = false;
            });
        };
        Clientes.prototype.reject = function (x) {
            var _this = this;
            x.isLoading = true;
            var viewModel = new foodServiceViewModel_1.FoodServiceConnectionViewModel();
            viewModel.foodService = x.foodService;
            viewModel.status = 3;
            this.repository
                .updateConnection(viewModel)
                .then(function (data) {
                x.isLoading = false;
                _this.loadData();
                _this.nService.presentSuccess('Status rejeitado com sucesso!');
            }).catch(function (e) {
                _this.nService.presentError(e);
                x.isLoading = false;
            });
        };
        Clientes.prototype.block = function (x) {
            var _this = this;
            x.isLoading = true;
            var viewModel = new foodServiceViewModel_1.FoodServiceConnectionViewModel();
            viewModel.foodService = x.foodService;
            viewModel.status = 4;
            this.repository
                .updateConnection(viewModel)
                .then(function (data) {
                x.isLoading = false;
                _this.loadData();
                _this.nService.presentSuccess('Status bloqueado com sucesso!');
            }).catch(function (e) {
                _this.nService.presentError(e);
                x.isLoading = false;
            });
        };
        Clientes.prototype.unblock = function (x) {
            var _this = this;
            x.isLoading = true;
            var viewModel = new foodServiceViewModel_1.FoodServiceConnectionViewModel();
            viewModel.foodService = x.foodService;
            viewModel.status = 2;
            this.repository
                .updateConnection(viewModel)
                .then(function (data) {
                x.isLoading = false;
                _this.loadData();
                _this.nService.presentSuccess('Status desbloqueado com sucesso!');
            }).catch(function (e) {
                _this.nService.presentError(e);
                x.isLoading = false;
            });
        };
        Clientes.prototype.search = function () {
            var _this = this;
            this.filteredFoodServices =
                this.foodServices.filter(function (x) {
                    var isFound = true;
                    if ((_this.filter != null && _this.filter != '')) {
                        if (x.foodService.name.toUpperCase().includes(_this.filter.toUpperCase())) {
                            isFound = true;
                        }
                        else {
                            isFound = false;
                        }
                    }
                    else {
                        return isFound;
                    }
                    return isFound;
                });
        };
        Clientes.prototype.showFoodServiceDetails = function (x) {
            this.showDetails = true;
            this.ea.publish('showFoodServiceDetails', { foodId: x.foodService.id, edit: false });
        };
        Clientes = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                foodServiceConnectionRepository_1.FoodServiceConnectionRepository,
                notificationService_1.NotificationService,
                aurelia_event_aggregator_1.EventAggregator])
        ], Clientes);
        return Clientes;
    }());
    exports.Clientes = Clientes;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/fornecedor/dashboard',["require", "exports", "aurelia-framework", "aurelia-api", "../../repositories/analytics/analyticsRepository", "../../services/identityService", "../../services/notificationService", "chart.js", "../../domain/analytics/orderPeriod", "../../repositories/evaluationRepository", "jquery", "popper.js", "bootstrap", "mdbootstrap", "velocity-animate", "velocity", "custom-scrollbar", "jquery-visible", "ie10-viewport"], function (require, exports, aurelia_framework_1, aurelia_api_1, analyticsRepository_1, identityService_1, notificationService_1, Chart, orderPeriod_1, evaluationRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(aurelia, config, service, repository, evalRepository, nService) {
            this.aurelia = aurelia;
            this.config = config;
            this.service = service;
            this.repository = repository;
            this.evalRepository = evalRepository;
            this.nService = nService;
            this.api = this.config.getEndpoint('csz');
            this.isLoadingNumberOfCustomers = true;
            this.isLoadingNumberOfOrders = true;
            this.period = orderPeriod_1.OrderPeriod.ThisYear;
        }
        App.prototype.attached = function () {
            this.loadData();
        };
        App.prototype.drawClientesChart = function (data) {
            var randomScalingFactor = function () {
                return Math.round(Math.random() * 100);
            };
            var values = [];
            data.items.forEach(function (x) { return values.push(x.total); });
            var colors = {
                blue: "rgb(54, 162, 235)",
                green: "rgb(75, 192, 192)",
                grey: "rgb(201, 203, 207)",
                orange: "rgb(255, 159, 64)",
                purple: "rgb(153, 102, 255)",
                red: "rgb(255, 99, 132)",
                yellow: "rgb(255, 205, 86)"
            };
            var config = {
                type: 'pie',
                data: {
                    datasets: [{
                            data: values,
                            backgroundColor: [
                                colors.red,
                                colors.orange,
                                colors.yellow,
                                colors.green,
                                colors.blue,
                            ],
                            label: 'Clientes'
                        }],
                    labels: data.labels
                },
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    }
                }
            };
            var ctx = document.getElementById('principaisClientesChart').getContext('2d');
            this.clientesChart = new Chart(ctx, config);
        };
        App.prototype.drawProductsChart = function (data) {
            var randomScalingFactor = function () {
                return Math.round(Math.random() * 100);
            };
            var values = [];
            data.items.forEach(function (x) { return values.push(x.total); });
            var colors = {
                blue: "rgb(54, 162, 235)",
                green: "rgb(75, 192, 192)",
                grey: "rgb(201, 203, 207)",
                orange: "rgb(255, 159, 64)",
                purple: "rgb(153, 102, 255)",
                red: "rgb(255, 99, 132)",
                yellow: "rgb(255, 205, 86)"
            };
            var config = {
                type: 'pie',
                data: {
                    datasets: [{
                            data: values,
                            backgroundColor: [
                                colors.green,
                                colors.blue,
                                colors.red,
                                colors.orange,
                                colors.yellow
                            ],
                            label: 'Produtos'
                        }],
                    labels: data.labels
                },
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    }
                }
            };
            var ctx = document.getElementById('principaisProdutosChart').getContext('2d');
            this.produtosChart = new Chart(ctx, config);
        };
        App.prototype.drawPedidosChart = function (data) {
            var color = Chart.helpers.color;
            var values0 = [];
            data[0].items.forEach(function (x) { return values0.push(x.total); });
            var values1 = [];
            data[1].items.forEach(function (x) { return values1.push(x.total); });
            var chartData = {
                labels: data[0].labels,
                datasets: [{
                        label: data[0].name,
                        backgroundColor: color("rgb(54, 162, 235)").alpha(0.5).rgbString(),
                        borderColor: "rgb(54, 162, 235)",
                        borderWidth: 1,
                        data: values0
                    }, {
                        label: data[1].name,
                        backgroundColor: color("rgb(255, 99, 132)").alpha(0.5).rgbString(),
                        borderColor: "rgb(255, 99, 132)",
                        borderWidth: 1,
                        data: values1
                    }]
            };
            var ctx = document.getElementById('pedidos').getContext('2d');
            if (this.pedidosChart != null) {
                this.pedidosChart.destroy();
            }
            this.pedidosChart = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    legend: {
                        position: 'top',
                    }
                }
            });
        };
        App.prototype.loadData = function () {
        };
        App.prototype.loadOrdersValues = function (period) {
            var _this = this;
            if (this.pedidosChart != null) {
                this.pedidosChart.destroy();
                this.pedidosChart = null;
            }
            this.repository
                .getOrdersValues(period)
                .then(function (x) { return _this.drawPedidosChart(x); })
                .catch(function (e) {
                _this.nService.error(e);
                _this.isLoadingNumberOfOrders = false;
            });
        };
        App.prototype.loadMainClients = function (period) {
            var _this = this;
            if (this.clientesChart != null) {
                this.clientesChart.destroy();
                this.clientesChart = null;
            }
            this.repository
                .getMainClients(period)
                .then(function (x) { return _this.drawClientesChart(x); })
                .catch(function (e) {
                _this.nService.error(e);
                _this.isLoadingNumberOfOrders = false;
            });
        };
        App.prototype.loadMainProdutcs = function () {
            var _this = this;
            if (this.produtosChart != null) {
                this.produtosChart.destroy();
                this.produtosChart = null;
            }
            this.repository
                .getMainProducts()
                .then(function (x) { return _this.drawProductsChart(x); })
                .catch(function (e) {
                _this.nService.error(e);
                _this.isLoadingNumberOfOrders = false;
            });
        };
        App = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_framework_1.Aurelia,
                aurelia_api_1.Config,
                identityService_1.IdentityService,
                analyticsRepository_1.AnalyticsRepository,
                evaluationRepository_1.EvaluationRepository,
                notificationService_1.NotificationService])
        ], App);
        return App;
    }());
    exports.App = App;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/fornecedor/evaluations',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../services/notificationService", "../../repositories/evaluationRepository", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, notificationService_1, evaluationRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Evaluations = (function () {
        function Evaluations(router, ea, repository, nService) {
            this.router = router;
            this.ea = ea;
            this.repository = repository;
            this.nService = nService;
        }
        Evaluations.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.selectedStatus = 0;
            this.loadData();
        };
        Evaluations.prototype.loadData = function () {
            this.load();
        };
        Evaluations.prototype.load = function () {
            var _this = this;
            this.repository
                .getMyEvaluations()
                .then(function (x) {
                _this.evaluations = x;
                _this.filteredEvaluations = x;
                _this.ea.publish('dataLoaded');
            })
                .catch(function (e) {
                _this.ea.publish('dataLoaded');
                _this.nService.presentError(e);
            });
        };
        Evaluations.prototype.showDetails = function (evaluation) {
            this.evaluation = evaluation;
        };
        Evaluations = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                evaluationRepository_1.EvaluationRepository,
                notificationService_1.NotificationService])
        ], Evaluations);
        return Evaluations;
    }());
    exports.Evaluations = Evaluations;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/fornecedor/produtos',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "twitter-bootstrap-wizard", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Produtos = (function () {
        function Produtos(router, ea) {
            this.router = router;
            this.ea = ea;
            this.productAddedCount = 0;
            this.ea.publish('loadingData');
        }
        Produtos.prototype.attached = function () {
            var _this = this;
            this.ea.subscribe('newProductsUpdated', function (length) {
                _this.productAddedCount = length;
            });
            this.ea.subscribe('selecaoDeProdutosLoaded', function () {
                _this.selecaoDeProdutosLoaded = true;
                if (_this.selecaoDeProdutosLoaded && _this.historicoDeImportacaoLoaded && _this.listaDePrecosLoaded && _this.atualizacaoDePrecosLoaded) {
                    _this.ea.publish('dataLoaded');
                }
            });
            this.ea.subscribe('historicoDeImportacaoLoaded', function () {
                _this.historicoDeImportacaoLoaded = true;
                if (_this.selecaoDeProdutosLoaded && _this.historicoDeImportacaoLoaded && _this.listaDePrecosLoaded && _this.atualizacaoDePrecosLoaded) {
                    _this.ea.publish('dataLoaded');
                }
            });
            this.ea.subscribe('listaDePrecosLoaded', function () {
                _this.listaDePrecosLoaded = true;
                if (_this.selecaoDeProdutosLoaded && _this.historicoDeImportacaoLoaded && _this.listaDePrecosLoaded && _this.atualizacaoDePrecosLoaded) {
                    _this.ea.publish('dataLoaded');
                }
            });
            this.ea.subscribe('atualizacaoDePrecosLoaded', function () {
                _this.atualizacaoDePrecosLoaded = true;
                if (_this.selecaoDeProdutosLoaded && _this.historicoDeImportacaoLoaded && _this.listaDePrecosLoaded && _this.atualizacaoDePrecosLoaded) {
                    _this.ea.publish('dataLoaded');
                }
            });
        };
        Produtos = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator])
        ], Produtos);
        return Produtos;
    }());
    exports.Produtos = Produtos;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/fornecedor/regrasDeMercado',["require", "exports", "../../validators/marketRuleValidator", "../../domain/marketRule", "../../repositories/marketRuleRepository", "../../services/notificationService", "../../services/identityService", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "jquery-mask-plugin"], function (require, exports, marketRuleValidator_1, marketRule_1, marketRuleRepository_1, notificationService_1, identityService_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RegrasDeMercado = (function () {
        function RegrasDeMercado(router, service, ea, nService, repository) {
            this.router = router;
            this.service = service;
            this.ea = ea;
            this.nService = nService;
            this.repository = repository;
            this.isLoading = false;
        }
        RegrasDeMercado.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.loadData();
        };
        RegrasDeMercado.prototype.loadData = function () {
            var _this = this;
            var identity = this.service.getIdentity();
            this.repository
                .getRule(identity.id)
                .then(function (rule) {
                if (rule == null) {
                    _this.rule = new marketRule_1.MarketRule();
                }
                else {
                    _this.rule = rule;
                }
                _this.validator = new marketRuleValidator_1.MarketRuleValidator(_this.rule);
                _this.validator.validate();
            })
                .then(function () { return _this.ea.publish('dataLoaded'); })
                .catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        RegrasDeMercado.prototype.save = function () {
            var _this = this;
            var errors = this.validator.validate();
            if (!this.rule.sendNotificationToNewOrder) {
                this.rule.receiverNewOrder = '';
            }
            if (!this.rule.sendNotificationToNewClient) {
                this.rule.receiverNewClient = '';
            }
            if (errors.length == 0) {
                this.isLoading = true;
                this.repository
                    .save(this.rule)
                    .then(function (result) {
                    _this.nService.success('Cadastro realizado!');
                    _this.router.navigate('/#/dashboard');
                    _this.isLoading = false;
                }).catch(function (e) {
                    _this.nService.error(e);
                    _this.isLoading = false;
                });
            }
            else {
                errors.forEach(function (error) {
                    _this.nService.error(error);
                });
            }
        };
        RegrasDeMercado = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                identityService_1.IdentityService,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                marketRuleRepository_1.MarketRuleRepository])
        ], RegrasDeMercado);
        return RegrasDeMercado;
    }());
    exports.RegrasDeMercado = RegrasDeMercado;
});



define('domain/analytics/genericAnalytics',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenericAnalytics = (function () {
        function GenericAnalytics() {
        }
        return GenericAnalytics;
    }());
    exports.GenericAnalytics = GenericAnalytics;
});



define('domain/analytics/orderPeriod',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OrderPeriod;
    (function (OrderPeriod) {
        OrderPeriod[OrderPeriod["ThisMonth"] = 0] = "ThisMonth";
        OrderPeriod[OrderPeriod["ThisYear"] = 1] = "ThisYear";
        OrderPeriod[OrderPeriod["All"] = 2] = "All";
    })(OrderPeriod = exports.OrderPeriod || (exports.OrderPeriod = {}));
});



define('domain/analytics/analyticsSerie',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AnalyticsSerie = (function () {
        function AnalyticsSerie() {
        }
        return AnalyticsSerie;
    }());
    exports.AnalyticsSerie = AnalyticsSerie;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/admin/foodService/editFoodService',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-api", "aurelia-event-aggregator", "../../../services/notificationService", "../../../repositories/stateRegistrationRepository", "../../../domain/user", "../../../repositories/userRepository", "../../../domain/userType", "../../../domain/foodService", "../../../repositories/foodServiceRepository", "../../../services/consultaCEPService", "../../../validators/foodServiceValidator", "../../../domain/address", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_api_1, aurelia_event_aggregator_1, notificationService_1, stateRegistrationRepository_1, user_1, userRepository_1, userType_1, foodService_1, foodServiceRepository_1, consultaCEPService_1, foodServiceValidator_1, address_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditFoodService = (function () {
        function EditFoodService(router, ea, nService, stateRepo, userRepository, config, repository, consultaCepService) {
            var _this = this;
            this.router = router;
            this.ea = ea;
            this.nService = nService;
            this.stateRepo = stateRepo;
            this.userRepository = userRepository;
            this.config = config;
            this.repository = repository;
            this.consultaCepService = consultaCepService;
            this.foodService = new foodService_1.FoodService();
            this.foodService.address = new address_1.Address();
            this.user = new user_1.User();
            this.edit = true;
            this.ea.subscribe('showFoodServiceDetails', function (event) {
                _this.foodId = event.foodId;
                _this.edit = event.edit;
                _this.loadData();
            });
        }
        EditFoodService.prototype.attached = function () {
            this.loadData();
        };
        EditFoodService.prototype.activate = function (params) {
            if (params != null && params.foodId) {
                this.foodId = params.foodId;
            }
        };
        EditFoodService.prototype.loadData = function () {
            var _this = this;
            if (this.foodId != null && this.foodId != '') {
                this.ea.publish('loadingData');
                var p1 = this.repository
                    .get(this.foodId)
                    .then(function (x) { return _this.foodService = x; })
                    .catch(function (e) { return _this.nService.presentError(e); });
                var p2 = this.stateRepo
                    .getAll()
                    .then(function (data) { return _this.stateRegistrations = data; })
                    .catch(function (e) { return _this.nService.presentError(e); });
                var p3 = this.userRepository
                    .getUsersFromFoodService(this.foodId)
                    .then(function (data) { return _this.users = data; })
                    .catch(function (e) { return _this.nService.presentError(e); });
                Promise.all([p1, p2, p3]).then(function () {
                    _this.ea.publish('dataLoaded');
                    if (_this.foodService.address == null) {
                        _this.foodService.address = new address_1.Address();
                    }
                    _this.validator = new foodServiceValidator_1.FoodServiceValidator(_this.foodService);
                });
            }
        };
        EditFoodService.prototype.save = function () {
            var _this = this;
            this.repository
                .save(this.foodService)
                .then(function () {
                _this.nService.presentSuccess('Cadastro atualizado com sucesso!');
            }).catch(function (e) {
                _this.nService.error(e);
            });
        };
        EditFoodService.prototype.cancel = function () {
            this.router.navigateToRoute('foodServicesAdmin');
        };
        EditFoodService.prototype.editUser = function (x) {
            x.isEditing = true;
            x._name = x.name;
            x._email = x.email;
        };
        EditFoodService.prototype.cancelEditUser = function (x) {
            x.isEditing = false;
            x.name = x._name;
            x.email = x._email;
        };
        EditFoodService.prototype.editUserStatus = function (x, status) {
            var _this = this;
            x._status = status;
            x.status = status;
            this.userRepository
                .save(x)
                .then(function (x) {
                _this.nService.presentSuccess('Usuário atualizado com sucesso!');
            }).catch(function (e) {
                x.status = x._status;
                _this.nService.error(e);
            });
        };
        EditFoodService.prototype.saveEditUser = function (x) {
            var _this = this;
            this.userRepository
                .save(x)
                .then(function () {
                _this.nService.presentSuccess('Usuário atualizado com sucesso!');
                x.isEditing = false;
            }).catch(function (e) {
                _this.nService.error(e);
            });
        };
        EditFoodService.prototype.createUser = function () {
            var _this = this;
            this.user.foodService = this.foodService;
            this.user.type = userType_1.UserType.FoodService;
            this.userRepository
                .save(this.user)
                .then(function (x) {
                _this.nService.presentSuccess('Usuário atualizado com sucesso!');
                _this.users.unshift(x);
                _this.user = new user_1.User();
            }).catch(function (e) {
                _this.nService.error(e);
            });
        };
        EditFoodService.prototype.cancelCreateUser = function () {
            this.user = new user_1.User();
        };
        EditFoodService.prototype.resendInvite = function (user) {
            var _this = this;
            this.userRepository
                .resendInvite(user.id)
                .then(function () {
                _this.nService.presentSuccess('Invite enviado com sucesso!');
            })
                .catch(function (e) { return _this.nService.presentError(e); });
        };
        EditFoodService.prototype.editStatus = function (status) {
            var _this = this;
            this.repository
                .updateStatus(this.foodService.id, status)
                .then(function () {
                _this.foodService.status = status;
                _this.nService.presentSuccess('Status atualizado com sucesso!');
            })
                .catch(function (e) { return _this.nService.presentError(e); });
        };
        EditFoodService.prototype.cancelUpload = function () {
            this.selectedFiles = [];
            document.getElementById("files").value = "";
        };
        EditFoodService.prototype.downloadSocialContract = function () {
            var api = this.config.getEndpoint('csz');
            window.open(api.client.baseUrl + 'downloadFoodServiceContractSocial?foodServiceId=' + this.foodService.id, '_blank');
        };
        EditFoodService.prototype.uploadSocialContract = function () {
            var _this = this;
            this.isUploading = true;
            var formData = new FormData();
            for (var i = 0; i < this.selectedFiles.length; i++) {
                formData.append('file', this.selectedFiles[i]);
            }
            this.repository
                .uploadSocialContract(formData, this.foodService.id)
                .then(function () {
                _this.isUploading = false;
                document.getElementById("files").value = "";
                _this.nService.presentSuccess('Contrato atualizado com sucesso!');
            }).catch(function (e) {
                _this.selectedFiles = [];
                _this.nService.error(e);
                _this.isUploading = false;
            });
        };
        EditFoodService.prototype.consultaCEP = function () {
            var _this = this;
            this.validator.addressValidator.validateCep();
            if (this.foodService.address.cep.length >= 8) {
                this.consultaCepService
                    .findCEP(this.foodService.address.cep)
                    .then(function (result) {
                    if (result != null) {
                        _this.foodService.address.city = result.localidade;
                        _this.foodService.address.neighborhood = result.bairro;
                        _this.foodService.address.number = null;
                        _this.foodService.address.logradouro = result.logradouro;
                        _this.foodService.address.complement = result.complemento;
                        _this.foodService.address.state = result.uf;
                        _this.validator.validate();
                    }
                }).catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
        };
        EditFoodService.prototype.cancelShowDetails = function () {
            this.ea.publish('showFoodServiceDetailsCanceled');
        };
        EditFoodService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                stateRegistrationRepository_1.StateRegistrationRepository,
                userRepository_1.UserRepository,
                aurelia_api_1.Config,
                foodServiceRepository_1.FoodServiceRepository,
                consultaCEPService_1.ConsultaCEPService])
        ], EditFoodService);
        return EditFoodService;
    }());
    exports.EditFoodService = EditFoodService;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/admin/foodService/listFoodServices',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../../services/notificationService", "../../../repositories/foodServiceRepository", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, notificationService_1, foodServiceRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListFoodServices = (function () {
        function ListFoodServices(router, ea, nService, repository) {
            this.router = router;
            this.ea = ea;
            this.nService = nService;
            this.repository = repository;
            this.foodServices = [];
        }
        ListFoodServices.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.loadData();
        };
        ListFoodServices.prototype.loadData = function () {
            var _this = this;
            this.repository
                .getAll()
                .then(function (x) {
                _this.foodServices = x;
                _this.filteredFoodServices = x;
                _this.ea.publish('dataLoaded');
            })
                .catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ListFoodServices.prototype.search = function () {
            var _this = this;
            this.filteredFoodServices = this.foodServices.filter(function (x) {
                var isFound = true;
                if ((_this.selectedStatus != null && _this.selectedStatus != '')) {
                    if (x.status.toString() == _this.selectedStatus) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if ((_this.filter != null && _this.filter != '')) {
                    if (x.name.toUpperCase().includes(_this.filter.toUpperCase())
                        || x.contact.name.toUpperCase().includes(_this.filter.toUpperCase())
                        || x.contact.email.toUpperCase().includes(_this.filter.toUpperCase())) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if (isFound) {
                    return x;
                }
            });
        };
        ListFoodServices.prototype.edit = function (x) {
            this.router.navigateToRoute('editFoodServiceAdmin', { foodId: x.id });
        };
        ListFoodServices.prototype.editStatus = function (x, status) {
            var _this = this;
            this.repository
                .updateStatus(x.id, status)
                .then(function () {
                x.status = status;
                _this.nService.presentSuccess('Status atualizado com sucesso!');
            })
                .catch(function (e) { return _this.nService.presentError(e); });
        };
        ListFoodServices.prototype.inactivate = function (x) {
            this.router.navigateToRoute('editFoodServiceAdmin', { foodId: x.id });
        };
        ListFoodServices = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                foodServiceRepository_1.FoodServiceRepository])
        ], ListFoodServices);
        return ListFoodServices;
    }());
    exports.ListFoodServices = ListFoodServices;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/admin/product/listProduct',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../../services/notificationService", "../../../repositories/productRepository", "../../../domain/product", "../../../repositories/unitOfMeasurementRepository", "aurelia-validation", "../../formValidationRenderer", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, notificationService_1, productRepository_1, product_1, unitOfMeasurementRepository_1, aurelia_validation_1, formValidationRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListProduct = (function () {
        function ListProduct(ea, nService, repository, unitRepository, productRepository, validationControllerFactory) {
            this.ea = ea;
            this.nService = nService;
            this.repository = repository;
            this.unitRepository = unitRepository;
            this.productRepository = productRepository;
            this.validationControllerFactory = validationControllerFactory;
            this.product = new product_1.Product();
            this.units = [];
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new formValidationRenderer_1.FormValidationRenderer());
            this.validationController.validateTrigger = aurelia_validation_1.validateTrigger.blur;
        }
        ListProduct.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.loadData();
        };
        ListProduct.prototype.activate = function () {
            aurelia_validation_1.ValidationRules
                .ensure(function (p) { return p.name; }).displayName('Nome do produto').required()
                .ensure(function (p) { return p.category; }).displayName('Categoria do produto').required()
                .on(this.product);
        };
        ListProduct.prototype.loadData = function () {
            var _this = this;
            this.productRepository
                .getAllClasses()
                .then(function (data) {
                _this.classes = data;
                _this.categories = data[0].categories;
                _this.selectedCategory = _this.categories[0];
                _this.searchProducts();
                _this.ea.publish('dataLoaded');
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
            this.unitRepository
                .getAll()
                .then(function (data) {
                _this.units = data;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ListProduct.prototype.updateCategories = function () {
            this.categories = this.selectedClass.categories;
            this.selectedCategory = this.categories[0];
            this.searchProducts();
            this.products = [];
            this.filteredProducts = [];
        };
        ListProduct.prototype.searchProducts = function () {
            var _this = this;
            if (this.selectedCategory != null) {
                this.isLoading = true;
                this.repository
                    .getAllProductsByCategory(this.selectedCategory.id)
                    .then(function (x) {
                    _this.products = x;
                    _this.filteredProducts = x;
                    _this.isLoading = false;
                    _this.search();
                })
                    .catch(function (e) {
                    _this.nService.presentError(e);
                    _this.isLoading = false;
                });
            }
            else {
                this.products = [];
                this.filteredProducts = [];
            }
        };
        ListProduct.prototype.search = function () {
            var _this = this;
            this.filteredProducts = this.products.filter(function (x) {
                var isFound = true;
                if ((_this.selectedCategory != null && _this.selectedCategory.id != '')) {
                    if (x.category.id == _this.selectedCategory.id) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if (isFound) {
                    if ((_this.filter != null && _this.filter != '')) {
                        if (x.name.toUpperCase().includes(_this.filter.toUpperCase())
                            || x.category.name.toUpperCase().includes(_this.filter.toUpperCase())
                            || x.brand != null && x.brand.name.toUpperCase().includes(_this.filter.toUpperCase())) {
                            isFound = true;
                        }
                        else {
                            isFound = false;
                        }
                    }
                }
                if (isFound) {
                    return x;
                }
            });
        };
        ListProduct.prototype.edit = function (product) {
            var _this = this;
            this.isEditing = true;
            this.product = product;
            this.selectedClassProduct = this.classes.filter(function (x) { return x.id == product.category.productClass.id; })[0];
            this.categories = this.selectedClassProduct.categories;
            this.product.category = this.categories.filter(function (x) { return x.id == _this.product.category.id; })[0];
            this.product.unit = this.units.filter(function (x) { return x.id == _this.product.unit.id; })[0];
        };
        ListProduct.prototype.create = function () {
            this.product = new product_1.Product();
            this.isEditing = true;
            this.product.isActive = true;
        };
        ListProduct.prototype.cancel = function () {
            this.isEditing = false;
            this.product = null;
        };
        ListProduct.prototype.addOrUpdate = function () {
            var _this = this;
            this.validationController
                .validate()
                .then(function (result) {
                if (result.valid) {
                    _this.isLoading = true;
                    _this.repository
                        .addOrUpdate(_this.product)
                        .then(function (x) {
                        _this.product = null;
                        _this.searchProducts();
                        _this.isEditing = false;
                        _this.isLoading = false;
                        _this.nService.success('Produto cadastrado com sucesso!');
                    })
                        .catch(function (e) {
                        _this.nService.error(e);
                        _this.isLoading = false;
                    });
                }
                else {
                    _this.nService.error('Erros de validação foram encontrados');
                }
            });
        };
        ListProduct = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                productRepository_1.ProductRepository,
                unitOfMeasurementRepository_1.UnitOfMeasurementRepository,
                productRepository_1.ProductRepository,
                aurelia_validation_1.ValidationControllerFactory])
        ], ListProduct);
        return ListProduct;
    }());
    exports.ListProduct = ListProduct;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/admin/product/listMarkets',["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../../../services/notificationService", "../../../repositories/productRepository", "../../../domain/productCategory", "../../../repositories/unitOfMeasurementRepository", "../../../domain/productClass", "aurelia-validation", "../../formValidationRenderer", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, notificationService_1, productRepository_1, productCategory_1, unitOfMeasurementRepository_1, productClass_1, aurelia_validation_1, formValidationRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListMarkets = (function () {
        function ListMarkets(ea, nService, repository, unitRepository, productRepository, validationControllerFactory) {
            this.ea = ea;
            this.nService = nService;
            this.repository = repository;
            this.unitRepository = unitRepository;
            this.productRepository = productRepository;
            this.validationControllerFactory = validationControllerFactory;
            this.market = new productClass_1.ProductClass();
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new formValidationRenderer_1.FormValidationRenderer());
            this.validationController.validateTrigger = aurelia_validation_1.validateTrigger.blur;
        }
        ListMarkets.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.loadData();
        };
        ListMarkets.prototype.activate = function () {
            aurelia_validation_1.ValidationRules
                .ensure(function (m) { return m.name; }).displayName('Nome do mercado').required()
                .on(this.market);
        };
        ListMarkets.prototype.loadData = function () {
            var _this = this;
            this.productRepository
                .getAllClasses()
                .then(function (data) {
                _this.classes = data;
                _this.ea.publish('dataLoaded');
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ListMarkets.prototype.edit = function (market) {
            this.isEditing = true;
            this.market = market;
        };
        ListMarkets.prototype.create = function () {
            this.market = new productClass_1.ProductClass();
            this.market.isActive = true;
            this.isEditing = true;
        };
        ListMarkets.prototype.cancel = function () {
            this.isEditing = false;
        };
        ListMarkets.prototype.editMarketStatus = function () {
            this.market.isActive = !this.market.isActive;
        };
        ListMarkets.prototype.editCategoryStatus = function (x) {
            x.isActive = !x.isActive;
        };
        ListMarkets.prototype.createCategory = function () {
            var x = new productCategory_1.ProductCategory();
            x.isActive = true;
            if (this.market.categories == null) {
                this.market.categories = [];
            }
            this.market.categories.unshift(x);
        };
        ListMarkets.prototype.addOrUpdate = function () {
            var _this = this;
            this.validationController
                .validate()
                .then(function (result) {
                if (result.valid) {
                    _this.isLoading = true;
                    _this.repository
                        .addOrUpdateClass(_this.market)
                        .then(function (x) {
                        _this.loadData();
                        _this.market = null;
                        _this.isEditing = false;
                        _this.isLoading = false;
                        _this.nService.success('Mercado cadastrado com sucesso!');
                    })
                        .catch(function (e) {
                        _this.nService.error(e);
                        _this.isLoading = false;
                    });
                }
                else {
                    _this.nService.error('Erros de validação foram encontrados');
                }
            });
        };
        ListMarkets = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                productRepository_1.ProductRepository,
                unitOfMeasurementRepository_1.UnitOfMeasurementRepository,
                productRepository_1.ProductRepository,
                aurelia_validation_1.ValidationControllerFactory])
        ], ListMarkets);
        return ListMarkets;
    }());
    exports.ListMarkets = ListMarkets;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/admin/finance/listInvoice',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../../services/notificationService", "../../../repositories/financeRepository", "../../../domain/invoiceStatus", "../../../domain/editInvoiceViewModel", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, notificationService_1, financeRepository_1, invoiceStatus_1, editInvoiceViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListInvoice = (function () {
        function ListInvoice(router, ea, nService, repository) {
            this.router = router;
            this.ea = ea;
            this.nService = nService;
            this.repository = repository;
            this.controls = [];
        }
        ListInvoice.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.loadData();
        };
        ListInvoice.prototype.changeControl = function () {
            this.filteredInvoices = this.selectedControl.invoices;
            this.search();
            this.calculateTotalValue();
        };
        ListInvoice.prototype.calculateTotalValue = function () {
            if (this.selectedControl.invoices != null) {
                this.totalValue = this.selectedControl.invoices.reduce(function (sum, current) { return sum + current.valueToPay; }, 0);
                this.totalValuePaid = this.selectedControl.invoices.filter(function (x) { return x.status == invoiceStatus_1.InvoiceStatus.Paid; }).reduce(function (sum, current) { return sum + current.valueToPay; }, 0);
            }
        };
        ListInvoice.prototype.loadData = function () {
            var _this = this;
            this.repository
                .getControls()
                .then(function (x) {
                _this.controls = x;
                if (x.length > 0) {
                    _this.selectedControl = x[0];
                    _this.filteredInvoices = x[0].invoices;
                    _this.calculateTotalValue();
                }
                _this.ea.publish('dataLoaded');
            })
                .catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ListInvoice.prototype.generateInvoices = function () {
            var _this = this;
            this.isLoading = true;
            this.repository
                .generateInvoices(this.selectedControl)
                .then(function (x) {
                _this.selectedControl.invoices = x;
                _this.filteredInvoices = x;
                if (_this.filteredInvoices.length == 0) {
                    _this.nService.presentError('Não há pedidos para gerar o faturamento');
                }
                _this.calculateTotalValue();
                _this.selectedControl.canGenerateInvoices = false;
                _this.isLoading = false;
            })
                .catch(function (e) {
                _this.nService.presentError(e);
                _this.isLoading = false;
            });
        };
        ListInvoice.prototype.edit = function (invoice) {
            this.isEditing = true;
            this.selectedInvoice = invoice;
            this.setInvoiceValues();
        };
        ListInvoice.prototype.cancelEdit = function () {
            this.isEditing = false;
        };
        ListInvoice.prototype.setInvoiceValues = function () {
            if (this.selectedInvoice.originalPrice == null) {
                this.selectedInvoice.originalPrice = this.selectedInvoice.totalValue;
            }
            if (this.selectedInvoice.originalFee == null) {
                this.selectedInvoice.originalFee = this.selectedInvoice.fee;
            }
        };
        ListInvoice.prototype.editStatus = function (invoice, status) {
            invoice.status = status;
            this.selectedInvoice = invoice;
            this.saveInvoice();
        };
        ListInvoice.prototype.saveInvoice = function () {
            var _this = this;
            this.isLoading = true;
            this.selectedInvoice.isEditing = true;
            var edit = new editInvoiceViewModel_1.EditInvoiceViewModel();
            edit.id = this.selectedInvoice.id;
            edit.fee = this.selectedInvoice.fee;
            edit.maturity = this.selectedInvoice.maturity;
            edit.status = this.selectedInvoice.status;
            edit.totalValue = this.selectedInvoice.totalValue;
            edit.valueToPay = this.selectedInvoice.valueToPay;
            this.repository
                .saveInvoice(edit)
                .then(function (x) {
                _this.nService.presentSuccess('Fatura atualizada com sucesso!');
                _this.isLoading = false;
                _this.selectedInvoice.isEditing = false;
                _this.calculateTotalValue();
            })
                .catch(function (e) {
                _this.nService.presentError(e);
                _this.isLoading = false;
                _this.selectedInvoice.isEditing = false;
            });
        };
        ListInvoice.prototype.calculateInvoicePrice = function () {
            this.selectedInvoice.valueToPay = this.selectedInvoice.totalValue * (this.selectedInvoice.fee / 100);
        };
        ListInvoice.prototype.cancelEditInvoicePrice = function () {
            if (this.selectedInvoice.originalPrice != null) {
                this.selectedInvoice.totalValue = this.selectedInvoice.originalPrice;
            }
            if (this.selectedInvoice.originalFee != null) {
                this.selectedInvoice.fee = this.selectedInvoice.originalFee;
            }
            this.calculateInvoicePrice();
        };
        ListInvoice.prototype.search = function () {
            var _this = this;
            this.filteredInvoices = this.selectedControl.invoices.filter(function (x) {
                var isFound = true;
                if ((_this.selectedStatus != null && _this.selectedStatus != '')) {
                    if (x.status.toString() == _this.selectedStatus) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if ((_this.filter != null && _this.filter != '')) {
                    if (x.supplier.name.toUpperCase().includes(_this.filter.toUpperCase())) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if (isFound) {
                    return x;
                }
            });
        };
        ListInvoice = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                financeRepository_1.FinanceRepository])
        ], ListInvoice);
        return ListInvoice;
    }());
    exports.ListInvoice = ListInvoice;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/admin/supplier/editSupplier',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-api", "aurelia-event-aggregator", "../../../services/notificationService", "../../../domain/supplier", "../../../repositories/supplierRepository", "../../../repositories/stateRegistrationRepository", "../../../domain/user", "../../../repositories/userRepository", "../../../domain/userType", "../../../validators/supplierValidator", "../../../services/consultaCEPService", "../../../domain/address", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_api_1, aurelia_event_aggregator_1, notificationService_1, supplier_1, supplierRepository_1, stateRegistrationRepository_1, user_1, userRepository_1, userType_1, supplierValidator_1, consultaCEPService_1, address_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditSupplier = (function () {
        function EditSupplier(router, ea, nService, stateRepo, userRepository, consultaCepService, config, repository) {
            var _this = this;
            this.router = router;
            this.ea = ea;
            this.nService = nService;
            this.stateRepo = stateRepo;
            this.userRepository = userRepository;
            this.consultaCepService = consultaCepService;
            this.config = config;
            this.repository = repository;
            this.supplier = new supplier_1.Supplier();
            this.supplier.address = new address_1.Address();
            this.user = new user_1.User();
            this.edit = true;
            this.ea.subscribe('showSupplierDetails', function (event) {
                _this.supplierId = event.supplierId;
                _this.edit = event.edit;
                _this.loadData();
            });
        }
        EditSupplier.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.loadData();
        };
        EditSupplier.prototype.activate = function (params) {
            if (params != null && params.supplierId) {
                this.supplierId = params.supplierId;
            }
        };
        EditSupplier.prototype.loadData = function () {
            var _this = this;
            if (this.supplierId != null && this.supplierId != '') {
                var p1 = this.repository
                    .get(this.supplierId)
                    .then(function (x) { return _this.supplier = x; })
                    .catch(function (e) { return _this.nService.presentError(e); });
                var p2 = this.stateRepo
                    .getAll()
                    .then(function (data) { return _this.stateRegistrations = data; })
                    .catch(function (e) { return _this.nService.presentError(e); });
                var p3 = this.userRepository
                    .getUsersFromSupplier(this.supplierId)
                    .then(function (data) { return _this.users = data; })
                    .catch(function (e) { return _this.nService.presentError(e); });
                Promise.all([p1, p2, p3]).then(function () {
                    _this.ea.publish('dataLoaded');
                    if (_this.supplier.address == null) {
                        _this.supplier.address = new address_1.Address();
                    }
                    _this.validator = new supplierValidator_1.SupplierValidator(_this.supplier);
                });
            }
        };
        EditSupplier.prototype.cancelUpload = function () {
            this.selectedFiles = [];
            document.getElementById("files").value = "";
        };
        EditSupplier.prototype.downloadSocialContract = function () {
            var api = this.config.getEndpoint('csz');
            window.open(api.client.baseUrl + 'downloadSupplierContractSocial?supplierId=' + this.supplier.id, '_blank');
        };
        EditSupplier.prototype.uploadSocialContract = function () {
            var _this = this;
            this.isUploading = true;
            var formData = new FormData();
            for (var i = 0; i < this.selectedFiles.length; i++) {
                formData.append('file', this.selectedFiles[i]);
            }
            this.repository
                .uploadSocialContract(formData, this.supplier.id)
                .then(function () {
                _this.isUploading = false;
                document.getElementById("files").value = "";
                _this.nService.presentSuccess('Contrato atualizado com sucesso!');
            }).catch(function (e) {
                _this.selectedFiles = [];
                _this.nService.error(e);
                _this.isUploading = false;
            });
        };
        EditSupplier.prototype.save = function () {
            var _this = this;
            this.repository
                .save(this.supplier)
                .then(function () {
                _this.nService.presentSuccess('Cadastro atualizado com sucesso!');
            }).catch(function (e) {
                _this.nService.error(e);
            });
        };
        EditSupplier.prototype.cancel = function () {
            this.router.navigateToRoute('suppliersAdmin');
        };
        EditSupplier.prototype.editUser = function (x) {
            x.isEditing = true;
            x._name = x.name;
            x._email = x.email;
        };
        EditSupplier.prototype.cancelEditUser = function (x) {
            x.isEditing = false;
            x.name = x._name;
            x.email = x._email;
        };
        EditSupplier.prototype.editUserStatus = function (x, status) {
            var _this = this;
            x._status = status;
            x.status = status;
            this.userRepository
                .save(x)
                .then(function (x) {
                _this.nService.presentSuccess('Usuário atualizado com sucesso!');
            }).catch(function (e) {
                x.status = x._status;
                _this.nService.error(e);
            });
        };
        EditSupplier.prototype.saveEditUser = function (x) {
            var _this = this;
            this.userRepository
                .save(x)
                .then(function () {
                _this.nService.presentSuccess('Usuário atualizado com sucesso!');
                x.isEditing = false;
            }).catch(function (e) {
                _this.nService.error(e);
            });
        };
        EditSupplier.prototype.createUser = function () {
            var _this = this;
            this.user.supplier = this.supplier;
            this.user.type = userType_1.UserType.Supplier;
            this.userRepository
                .save(this.user)
                .then(function (x) {
                _this.nService.presentSuccess('Usuário atualizado com sucesso!');
                _this.users.unshift(x);
                _this.user = new user_1.User();
            }).catch(function (e) {
                _this.nService.error(e);
            });
        };
        EditSupplier.prototype.cancelCreateUser = function () {
            this.user = new user_1.User();
        };
        EditSupplier.prototype.resendInvite = function (user) {
            var _this = this;
            this.userRepository
                .resendInvite(user.id)
                .then(function () {
                _this.nService.presentSuccess('Invite enviado com sucesso!');
            })
                .catch(function (e) { return _this.nService.presentError(e); });
        };
        EditSupplier.prototype.editStatus = function (status) {
            var _this = this;
            this.repository
                .updateStatus(this.supplier.id, status)
                .then(function () {
                _this.supplier.status = status;
                _this.nService.presentSuccess('Status atualizado com sucesso!');
            })
                .catch(function (e) { return _this.nService.presentError(e); });
        };
        EditSupplier.prototype.consultaCEP = function () {
            var _this = this;
            this.validator.addressValidator.validateCep();
            if (this.supplier.address.cep.length >= 8) {
                this.consultaCepService
                    .findCEP(this.supplier.address.cep)
                    .then(function (result) {
                    if (result != null) {
                        _this.supplier.address.city = result.localidade;
                        _this.supplier.address.neighborhood = result.bairro;
                        _this.supplier.address.number = null;
                        _this.supplier.address.logradouro = result.logradouro;
                        _this.supplier.address.complement = result.complemento;
                        _this.supplier.address.state = result.uf;
                        _this.validator.validate();
                    }
                }).catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
        };
        EditSupplier.prototype.cancelView = function () {
            this.ea.publish('showSupplierDetailsCanceled');
        };
        EditSupplier = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                stateRegistrationRepository_1.StateRegistrationRepository,
                userRepository_1.UserRepository,
                consultaCEPService_1.ConsultaCEPService,
                aurelia_api_1.Config,
                supplierRepository_1.SupplierRepository])
        ], EditSupplier);
        return EditSupplier;
    }());
    exports.EditSupplier = EditSupplier;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/admin/supplier/listSuppliers',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../../services/notificationService", "../../../repositories/supplierRepository", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, notificationService_1, supplierRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListSuppliers = (function () {
        function ListSuppliers(router, ea, nService, repository) {
            this.router = router;
            this.ea = ea;
            this.nService = nService;
            this.repository = repository;
            this.suppliers = [];
        }
        ListSuppliers.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.loadData();
        };
        ListSuppliers.prototype.loadData = function () {
            var _this = this;
            this.repository
                .getAllSuppliers()
                .then(function (x) {
                _this.suppliers = x;
                _this.filteredSuppliers = x;
                _this.ea.publish('dataLoaded');
            })
                .catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ListSuppliers.prototype.search = function () {
            var _this = this;
            this.filteredSuppliers = this.suppliers.filter(function (x) {
                var isFound = true;
                if ((_this.selectedStatus != null && _this.selectedStatus != '')) {
                    if (x.status.toString() == _this.selectedStatus) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if ((_this.filter != null && _this.filter != '')) {
                    if (x.name.toUpperCase().includes(_this.filter.toUpperCase())
                        || x.contact.name.toUpperCase().includes(_this.filter.toUpperCase())
                        || x.contact.email.toUpperCase().includes(_this.filter.toUpperCase())) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if (isFound) {
                    return x;
                }
            });
        };
        ListSuppliers.prototype.edit = function (x) {
            this.router.navigateToRoute('editSupplierAdmin', { supplierId: x.id });
        };
        ListSuppliers.prototype.editStatus = function (x, status) {
            var _this = this;
            this.repository
                .updateStatus(x.id, status)
                .then(function () {
                x.status = status;
                _this.nService.presentSuccess('Status atualizado com sucesso!');
            })
                .catch(function (e) { return _this.nService.presentError(e); });
        };
        ListSuppliers.prototype.inactivate = function (x) {
            this.router.navigateToRoute('editSupplierAdmin', { supplierId: x.id });
        };
        ListSuppliers = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                supplierRepository_1.SupplierRepository])
        ], ListSuppliers);
        return ListSuppliers;
    }());
    exports.ListSuppliers = ListSuppliers;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/admin/supplier/evaluations',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../../services/notificationService", "../../../repositories/evaluationRepository", "../../../domain/evaluationStatus", "twitter-bootstrap-wizard", "jquery-mask-plugin", "aurelia-validation"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, notificationService_1, evaluationRepository_1, evaluationStatus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Evaluations = (function () {
        function Evaluations(router, ea, repository, nService) {
            this.router = router;
            this.ea = ea;
            this.repository = repository;
            this.nService = nService;
        }
        Evaluations.prototype.attached = function () {
            this.ea.publish('loadingData');
            this.selectedStatus = 0;
            this.loadData();
        };
        Evaluations.prototype.loadData = function () {
            this.load();
        };
        Evaluations.prototype.load = function () {
            var _this = this;
            this.repository
                .getEvaluations(this.selectedStatus)
                .then(function (x) {
                _this.evaluations = x;
                _this.filteredEvaluations = x;
                _this.ea.publish('dataLoaded');
            })
                .catch(function (e) {
                _this.ea.publish('dataLoaded');
                _this.nService.presentError(e);
            });
        };
        Evaluations.prototype.reject = function (evaluation) {
            var _this = this;
            evaluation.processing = true;
            this.repository
                .updateStatus(evaluation.id, evaluationStatus_1.EvaluationStatus.Rejected)
                .then(function () {
                evaluation.status = evaluationStatus_1.EvaluationStatus.Rejected;
                _this.nService.success('Avaliação alterada com sucesso!');
                evaluation.processing = false;
                _this.evaluation = null;
            })
                .catch(function (e) {
                _this.nService.error(e);
                evaluation.processing = false;
            });
        };
        Evaluations.prototype.approve = function (evaluation) {
            var _this = this;
            evaluation.processing = true;
            this.repository
                .updateStatus(evaluation.id, evaluationStatus_1.EvaluationStatus.Approved)
                .then(function () {
                evaluation.status = evaluationStatus_1.EvaluationStatus.Approved;
                _this.nService.success('Avaliação alterada com sucesso!');
                evaluation.processing = false;
                _this.evaluation = null;
            })
                .catch(function (e) {
                _this.nService.error(e);
                evaluation.processing = false;
            });
        };
        Evaluations.prototype.showDetails = function (evaluation) {
            this.evaluation = evaluation;
        };
        Evaluations = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_event_aggregator_1.EventAggregator,
                evaluationRepository_1.EvaluationRepository,
                notificationService_1.NotificationService])
        ], Evaluations);
        return Evaluations;
    }());
    exports.Evaluations = Evaluations;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/attributes/inscricaoEstadualMask',["require", "exports", "aurelia-framework", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InscricaoEstadualMask = (function () {
        function InscricaoEstadualMask(element) {
            this.element = element;
        }
        InscricaoEstadualMask.prototype.attached = function () {
            $(this.element).mask('000.000.000.000');
        };
        InscricaoEstadualMask = __decorate([
            aurelia_framework_1.customAttribute('inscricaoEstadual'),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element])
        ], InscricaoEstadualMask);
        return InscricaoEstadualMask;
    }());
    exports.InscricaoEstadualMask = InscricaoEstadualMask;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/attributes/numberMask',["require", "exports", "aurelia-framework", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberMask = (function () {
        function NumberMask(element) {
            this.element = element;
        }
        NumberMask.prototype.attached = function () {
            $(this.element).mask('00');
        };
        NumberMask = __decorate([
            aurelia_framework_1.customAttribute('number'),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element])
        ], NumberMask);
        return NumberMask;
    }());
    exports.NumberMask = NumberMask;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/attributes/datepicker',["require", "exports", "aurelia-framework", "jquery-datetimepicker"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DatePicker = (function () {
        function DatePicker(element) {
            this.element = element;
        }
        DatePicker.prototype.attached = function () {
            $(this.element).datetimepicker({
                onGenerate: function (ct) {
                },
                format: 'd/m/Y',
                timepicker: false,
                mask: true,
            })
                .on('blur', function (e) { return fireEvent(e.target, 'change'); });
        };
        DatePicker.prototype.detached = function () {
        };
        DatePicker = __decorate([
            aurelia_framework_1.customAttribute('datepicker'),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element])
        ], DatePicker);
        return DatePicker;
    }());
    exports.DatePicker = DatePicker;
    function fireEvent(element, name) {
        var event = document.createEvent('Event');
        event.initEvent(name, true, true);
        element.dispatchEvent(event);
    }
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/attributes/timeMask',["require", "exports", "aurelia-framework", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimeMask = (function () {
        function TimeMask(element) {
            this.element = element;
        }
        TimeMask.prototype.attached = function () {
            $(this.element).mask('00:00');
            var other = this;
        };
        TimeMask = __decorate([
            aurelia_framework_1.customAttribute('time'),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element])
        ], TimeMask);
        return TimeMask;
    }());
    exports.TimeMask = TimeMask;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/attributes/cellPhoneWithDDDMask',["require", "exports", "aurelia-framework", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellPhoneWithDDDMask = (function () {
        function CellPhoneWithDDDMask(element) {
            this.element = element;
        }
        CellPhoneWithDDDMask.prototype.attached = function () {
            $(this.element).mask('(00) 00000-0000');
        };
        CellPhoneWithDDDMask = __decorate([
            aurelia_framework_1.customAttribute('cell-phone-with-ddd'),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element])
        ], CellPhoneWithDDDMask);
        return CellPhoneWithDDDMask;
    }());
    exports.CellPhoneWithDDDMask = CellPhoneWithDDDMask;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/attributes/moneyMask',["require", "exports", "aurelia-framework", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MoneyMask = (function () {
        function MoneyMask(element) {
            this.element = element;
        }
        MoneyMask.prototype.attached = function () {
            $(this.element).mask('000.000.000.000.000,00', { reverse: true });
        };
        MoneyMask = __decorate([
            aurelia_framework_1.customAttribute('money'),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element])
        ], MoneyMask);
        return MoneyMask;
    }());
    exports.MoneyMask = MoneyMask;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/attributes/cepMask',["require", "exports", "aurelia-framework", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CEPMask = (function () {
        function CEPMask(element) {
            this.element = element;
        }
        CEPMask.prototype.attached = function () {
            $(this.element).mask('00000-000');
        };
        CEPMask = __decorate([
            aurelia_framework_1.customAttribute('cep'),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element])
        ], CEPMask);
        return CEPMask;
    }());
    exports.CEPMask = CEPMask;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/attributes/cnpjMask',["require", "exports", "aurelia-framework", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CNPJMask = (function () {
        function CNPJMask(element) {
            this.element = element;
        }
        CNPJMask.prototype.attached = function () {
            $(this.element).mask('00.000.000/0000-00');
        };
        CNPJMask = __decorate([
            aurelia_framework_1.customAttribute('cnpj'),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element])
        ], CNPJMask);
        return CNPJMask;
    }());
    exports.CNPJMask = CNPJMask;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/attributes/phoneWithDDDMask',["require", "exports", "aurelia-framework", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PhoneWithDDDMask = (function () {
        function PhoneWithDDDMask(element) {
            this.element = element;
        }
        PhoneWithDDDMask.prototype.attached = function () {
            $(this.element).mask('(00) 0000-0000');
        };
        PhoneWithDDDMask = __decorate([
            aurelia_framework_1.customAttribute('phone-with-ddd'),
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [Element])
        ], PhoneWithDDDMask);
        return PhoneWithDDDMask;
    }());
    exports.PhoneWithDDDMask = PhoneWithDDDMask;
});



define('views/components/valueConverters/numberValueConverter',["require", "exports", "jquery-mask-plugin"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberValueConverter = (function () {
        function NumberValueConverter() {
        }
        NumberValueConverter.prototype.toView = function (value) {
            return value;
        };
        NumberValueConverter.prototype.fromView = function (value) {
            return value;
        };
        return NumberValueConverter;
    }());
    exports.NumberValueConverter = NumberValueConverter;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('views/components/valueConverters/timeValueConverter',["require", "exports", "aurelia-framework", "jquery-mask-plugin"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimeValueConverter = (function () {
        function TimeValueConverter() {
        }
        TimeValueConverter.prototype.toView = function (value) {
            if (value != null) {
                if (isNaN(value)) {
                    return '';
                }
                value = value + '';
                if (value.length == 1) {
                    if (Number.parseInt(value) < 10 && Number.parseInt(value) > 2) {
                        return '0' + value + ':00';
                    }
                    if (Number.parseInt(value) <= 2) {
                        return value;
                    }
                    return value + ':00';
                }
                if (value.length == 2) {
                    if (Number.parseInt(value) > 24) {
                        return '0' + value + '0';
                    }
                    else {
                        return value + ':00';
                    }
                }
                if (value.length == 3) {
                    var a = ('' + value).substr(0, 2);
                    var b = ('' + value).substr(2, 1);
                    if (value == '') {
                        return null;
                    }
                    if (Number.parseInt(a) > 24) {
                        var b = ('' + value).substr(1, 2);
                        if (Number.parseInt(b) > 59) {
                            b = '00';
                        }
                        return '0' + (value).substr(0, 1) + ':' + b;
                    }
                    if (Number.parseInt(b) > 5) {
                        b = '00';
                    }
                    return a + ':' + b;
                }
                else {
                    var a = ('' + value).substr(0, 2);
                    var b = ('' + value).substr(2, 2);
                    if (value == '') {
                        return null;
                    }
                    if (Number.parseInt(a) >= 24) {
                        return '';
                    }
                    if (b.substr(0, 1) == "0")
                        b = ((Number.parseInt(b) * 10) / 10).toString();
                    if (Number.parseInt(b) > 59) {
                        b = '00';
                    }
                    if (b.length < 2) {
                        b += '0';
                    }
                    return a + ':' + b;
                }
            }
        };
        TimeValueConverter.prototype.fromView = function (value) {
            return ('' + value).replace(":", "");
        };
        TimeValueConverter = __decorate([
            aurelia_framework_1.autoinject
        ], TimeValueConverter);
        return TimeValueConverter;
    }());
    exports.TimeValueConverter = TimeValueConverter;
});



define('views/components/valueConverters/dateAndTimeFormatValueConverter',["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DateAndTimeFormatValueConverter = (function () {
        function DateAndTimeFormatValueConverter() {
        }
        DateAndTimeFormatValueConverter.prototype.toView = function (value) {
            moment.locale('pt-BR');
            if (value == null || value == '')
                return '';
            return moment(value).format("DD/MM/YYYY HH:mm:ss");
        };
        DateAndTimeFormatValueConverter.prototype.fromView = function (value) {
            moment.locale('pt-BR');
            return moment(value, 'DD/MM/YYYY').utc().format("YYYY-MM-DD HH:mm:ssZ");
        };
        return DateAndTimeFormatValueConverter;
    }());
    exports.DateAndTimeFormatValueConverter = DateAndTimeFormatValueConverter;
});



define('views/components/valueConverters/moneyValueConverter',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MoneyValueConverter = (function () {
        function MoneyValueConverter() {
        }
        MoneyValueConverter.prototype.toView = function (value) {
            if (value != null) {
                var numero = value.toFixed(2).split('.');
                numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
                return numero.join(',');
            }
            return value;
        };
        MoneyValueConverter.prototype.fromView = function (value) {
            if (value != null) {
                return (value.split(".").join("").replace(",", "")) / 100;
            }
            return null;
        };
        return MoneyValueConverter;
    }());
    exports.MoneyValueConverter = MoneyValueConverter;
});



define('views/components/valueConverters/inscricaoEstadualValueConverter',["require", "exports", "jquery-mask-plugin"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InscricaoEstadualValueConverter = (function () {
        function InscricaoEstadualValueConverter() {
        }
        InscricaoEstadualValueConverter.prototype.toView = function (value) {
            if (value != null) {
                value = '' + value;
                var a = value.substr(0, 3);
                var b = value.substr(3, 3);
                var c = value.substr(6, 3);
                var d = value.substr(9, 3);
                return a + '.' + b + '.' + c + '.' + d;
            }
            return value;
        };
        InscricaoEstadualValueConverter.prototype.fromView = function (value) {
            if (value != null)
                return value.replace('.', '').replace('.', '').replace('.', '');
            return null;
        };
        return InscricaoEstadualValueConverter;
    }());
    exports.InscricaoEstadualValueConverter = InscricaoEstadualValueConverter;
});



define('views/components/valueConverters/dateFormatValueConverter',["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DateFormatValueConverter = (function () {
        function DateFormatValueConverter() {
        }
        DateFormatValueConverter.prototype.toView = function (value) {
            moment.locale('pt-BR');
            if (value == null || value == '')
                return null;
            return moment(value).format("DD/MM/YYYY");
        };
        DateFormatValueConverter.prototype.fromView = function (value) {
            moment.locale('pt-BR');
            if (value == null || value == '')
                return null;
            return moment(value, 'DD/MM/YYYY').utc().format("YYYY-MM-DD HH:mm:ssZ");
        };
        return DateFormatValueConverter;
    }());
    exports.DateFormatValueConverter = DateFormatValueConverter;
});



define('views/components/valueConverters/phoneWithDDDValueConverter',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PhoneWithDDDValueConverter = (function () {
        function PhoneWithDDDValueConverter() {
        }
        PhoneWithDDDValueConverter.prototype.toView = function (value) {
            if (value != null) {
                value = '' + value;
                var ddd = value.substr(0, 2);
                var firstPart = value.substr(2, 4);
                var lastPart = value.substr(6, 4);
                return '(' + ddd + ')' + ' ' + firstPart + '-' + lastPart;
            }
            return value;
        };
        PhoneWithDDDValueConverter.prototype.fromView = function (value) {
            if (value != null)
                return value.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');
            return null;
        };
        return PhoneWithDDDValueConverter;
    }());
    exports.PhoneWithDDDValueConverter = PhoneWithDDDValueConverter;
});



define('views/components/valueConverters/cepValueConverter',["require", "exports", "jquery-mask-plugin"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CepValueConverter = (function () {
        function CepValueConverter() {
        }
        CepValueConverter.prototype.toView = function (value) {
            if (value != null) {
                value = '' + value;
                var a = value.substr(0, 5);
                var b = value.substr(5, 3);
                return a + '-' + b;
            }
            return value;
        };
        CepValueConverter.prototype.fromView = function (value) {
            if (value != null) {
                return value.replace('-', '');
            }
            return null;
        };
        return CepValueConverter;
    }());
    exports.CepValueConverter = CepValueConverter;
});



define('views/components/valueConverters/cellPhoneWithDDDValueConverter',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellPhoneWithDDDValueConverter = (function () {
        function CellPhoneWithDDDValueConverter() {
        }
        CellPhoneWithDDDValueConverter.prototype.toView = function (value) {
            if (value != null) {
                value = '' + value;
                var ddd = value.substr(0, 2);
                var firstPart = value.substr(2, 5);
                var lastPart = value.substr(7, 4);
                return '(' + ddd + ')' + ' ' + firstPart + '-' + lastPart;
            }
            return value;
        };
        CellPhoneWithDDDValueConverter.prototype.fromView = function (value) {
            if (value != null)
                return value.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');
            return null;
        };
        return CellPhoneWithDDDValueConverter;
    }());
    exports.CellPhoneWithDDDValueConverter = CellPhoneWithDDDValueConverter;
});



define('views/components/valueConverters/cnpjValueConverter',["require", "exports", "jquery-mask-plugin"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CnpjValueConverter = (function () {
        function CnpjValueConverter() {
        }
        CnpjValueConverter.prototype.toView = function (value) {
            if (value != null) {
                value = '' + value;
                var a = value.substr(0, 2);
                var b = value.substr(2, 3);
                var c = value.substr(5, 3);
                var d = value.substr(8, 4);
                var e = value.substr(12, 2);
                return a + '.' + b + '.' + c + '/' + d + '-' + e;
            }
            return value;
        };
        CnpjValueConverter.prototype.fromView = function (value) {
            if (value != null)
                return value.replace('.', '').replace('.', '').replace('/', '').replace('-', '');
            return null;
        };
        return CnpjValueConverter;
    }());
    exports.CnpjValueConverter = CnpjValueConverter;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/atualizacaoDePrecos',["require", "exports", "aurelia-api", "../../../repositories/productRepository", "../../../services/notificationService", "../../../services/identityService", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../../../domain/SupplierProductStatus"], function (require, exports, aurelia_api_1, productRepository_1, notificationService_1, identityService_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, SupplierProductStatus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AtualizacaoDePrecos = (function () {
        function AtualizacaoDePrecos(router, service, nService, ea, productRepository, config, repository) {
            this.router = router;
            this.service = service;
            this.nService = nService;
            this.ea = ea;
            this.productRepository = productRepository;
            this.config = config;
            this.repository = repository;
            this.filteredProducts = new Array();
            this.supplierProducts = new Array();
            this.alteredProducts = new Array();
            this.isLoading = true;
        }
        AtualizacaoDePrecos.prototype.attached = function () {
            var _this = this;
            this.loadData();
            this.ea.subscribe('productAdded', function (product) {
                product.isNew = true;
                _this.supplierProducts.push(product);
                _this.isLoading = true;
                _this.supplierProducts = _this.supplierProducts.sort(function (a, b) { return 0 - (a.product.name > b.product.name ? -1 : 1); });
                _this.loadData().then(function () { return _this.search(); });
            });
        };
        AtualizacaoDePrecos.prototype.loadData = function () {
            var _this = this;
            return this.productRepository
                .getClassesByOfferedProducts()
                .then(function (data) {
                debugger;
                _this.classes = data;
                if (_this.selectedCategory == null) {
                    _this.selectedCategory = data[0].categories[0];
                }
                _this.ea.publish('atualizacaoDePrecosLoaded');
                _this.loadProducts();
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        AtualizacaoDePrecos.prototype.updateCategories = function () {
            this.selectedCategory = this.selectedClass.categories[0];
            this.loadProducts();
        };
        AtualizacaoDePrecos.prototype.loadProducts = function () {
            var _this = this;
            this.isLoading = true;
            this.supplierProducts = [];
            this.filteredProducts = [];
            this.alteredProducts = [];
            this.filter = '';
            this.repository
                .getAllSuplierProducts(this.selectedCategory.id)
                .then(function (data) {
                _this.supplierProducts = data;
                _this.filteredProducts = data;
                _this.isLoading = false;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        AtualizacaoDePrecos.prototype.search = function () {
            var _this = this;
            this.filteredProducts = this.supplierProducts.filter(function (x) {
                var isFound = true;
                if ((_this.selectedCategory != null && _this.selectedCategory.id != '')) {
                    if (x.product.category.id == _this.selectedCategory.id) {
                        isFound = true;
                    }
                    else {
                        isFound = false;
                    }
                }
                if (isFound) {
                    if ((_this.filter != null && _this.filter != '')) {
                        if (x.product.name.toUpperCase().includes(_this.filter.toUpperCase())
                            || x.product.category.name.toUpperCase().includes(_this.filter.toUpperCase())
                            || x.product.brand != null && x.product.brand.name.toUpperCase().includes(_this.filter.toUpperCase())) {
                            isFound = true;
                        }
                        else {
                            isFound = false;
                        }
                    }
                }
                if (isFound) {
                    return x;
                }
            });
        };
        AtualizacaoDePrecos.prototype.edit = function (product) {
            product.isEditing = true;
            product.oldPrice = product.price;
            product.oldStatus = product.status;
        };
        AtualizacaoDePrecos.prototype.cancelEdit = function (product) {
            product.isEditing = false;
            product.walAltered = false;
            product.price = product.oldPrice;
            product.status = product.oldStatus;
            this.alteredProducts = this.alteredProducts.filter(function (x) { return x.id != product.id; });
        };
        AtualizacaoDePrecos.prototype.alterStatus = function (product, status) {
            product.status = status;
        };
        AtualizacaoDePrecos.prototype.save = function (product) {
            var _this = this;
            this.alteredProducts.push(product);
            product.isEditing = false;
            product.wasAltered = true;
            product.isLoading = true;
            this.repository
                .alterSuplierProduct(this.alteredProducts)
                .then(function (result) {
                _this.nService.success('O produto foi atualizado com sucesso!');
                _this.isLoading = false;
                _this.ea.publish('uploadSupplierProductFileDone');
                _this.alteredProducts = [];
                product.isLoading = false;
                if (product.status == SupplierProductStatus_1.SupplierProductStatus.Removed) {
                    _this.filteredProducts = _this.filteredProducts.filter(function (x) { return x.id != product.id; });
                    _this.supplierProducts = _this.supplierProducts.filter(function (x) { return x.id != product.id; });
                    _this.ea.publish('supplierProductRemoved', product);
                }
            }).catch(function (e) {
                _this.nService.error(e);
                _this.isLoading = false;
            });
        };
        AtualizacaoDePrecos.prototype.downloadFile = function () {
            var userId = this.service.getIdentity().id;
            var api = this.config.getEndpoint('csz');
            window.open(api.client.baseUrl + 'downloadSupplierProducts?userId=' + userId, '_parent');
        };
        AtualizacaoDePrecos.prototype.uploadFile = function () {
            var _this = this;
            this.isUploading = true;
            var formData = new FormData();
            for (var i = 0; i < this.selectedFiles.length; i++) {
                formData.append('file', this.selectedFiles[i]);
            }
            this.repository
                .uploadFile(formData)
                .then(function (result) {
                _this.loadData();
                if (result.rows != null && result.rows.length > 0) {
                    var hasErrors = result.rows.filter(function (x) { return x.status == 1; }).length > 0;
                    if (hasErrors) {
                        _this.nService.error('Foram encontrados erros no arquivo. Verifique os detalhes no histórico de importação');
                    }
                    else {
                        _this.nService.success('O arquivo foi processado com sucesso');
                    }
                }
                else {
                    _this.nService.success('O arquivo foi processado com sucesso');
                }
                _this.selectedFiles = [];
                _this.ea.publish('uploadSupplierProductFileDone', result);
                _this.isUploading = false;
                document.getElementById("files").value = "";
            }).catch(function (e) {
                _this.selectedFiles = [];
                _this.nService.error(e);
                _this.isUploading = false;
            });
        };
        AtualizacaoDePrecos = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                identityService_1.IdentityService,
                notificationService_1.NotificationService,
                aurelia_event_aggregator_1.EventAggregator,
                productRepository_1.ProductRepository,
                aurelia_api_1.Config,
                productRepository_1.ProductRepository])
        ], AtualizacaoDePrecos);
        return AtualizacaoDePrecos;
    }());
    exports.AtualizacaoDePrecos = AtualizacaoDePrecos;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/aceitePedido',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "aurelia-validation", "../../../services/notificationService", "../../../repositories/orderRepository", "../../formValidationRenderer", "../../../domain/order", "../../../domain/orderStatus"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, aurelia_validation_1, notificationService_1, orderRepository_1, formValidationRenderer_1, order_1, orderStatus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AceitePedido = (function () {
        function AceitePedido(pController, validationControllerFactory, ea, notification, orderRepo) {
            this.validationControllerFactory = validationControllerFactory;
            this.ea = ea;
            this.notification = notification;
            this.orderRepo = orderRepo;
            this.controller = pController;
            this.order = new order_1.Order();
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new formValidationRenderer_1.FormValidationRenderer());
            this.validationController.validateTrigger = aurelia_validation_1.validateTrigger.blur;
            this.validationController.addObject(this.order);
            this.processing = false;
        }
        AceitePedido.prototype.activate = function (params) {
            if (params.Order != null) {
                this.order = params.Order;
            }
            aurelia_validation_1.ValidationRules
                .ensure(function (order) { return order.deliveryDate; }).displayName('Data de entrega').required()
                .ensure(function (order) { return order.paymentDate; }).displayName('Data de pagamento').required()
                .on(this.order);
        };
        AceitePedido.prototype.acceptOrder = function () {
            var _this = this;
            this.validationController
                .validate()
                .then(function (result) {
                if (result.valid) {
                    _this.processing = true;
                    _this.orderRepo
                        .acceptOrder(_this.order)
                        .then(function (x) {
                        _this.notification.success('Pedido atualizado com sucesso!');
                        _this.ea.publish('orderAccepted', _this.order);
                        _this.order.status = orderStatus_1.OrderStatus.Accepted;
                        _this.controller.ok();
                        _this.processing = false;
                    })
                        .catch(function (e) {
                        _this.notification.presentError(e);
                        _this.processing = false;
                    });
                }
                else {
                    _this.notification.error('Erros de validação foram encontrados');
                }
            });
        };
        AceitePedido.prototype.cancel = function () {
            this.controller.cancel();
        };
        AceitePedido = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController,
                aurelia_validation_1.ValidationControllerFactory,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                orderRepository_1.OrderRepository])
        ], AceitePedido);
        return AceitePedido;
    }());
    exports.AceitePedido = AceitePedido;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/deleteBuyList',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "../../../services/notificationService", "../../../domain/buyListStatus", "../../../repositories/foodServiceRepository"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, notificationService_1, buyListStatus_1, foodServiceRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeleteBuyList = (function () {
        function DeleteBuyList(pController, ea, notification, repo) {
            this.ea = ea;
            this.notification = notification;
            this.repo = repo;
            this.controller = pController;
            this.processing = false;
        }
        DeleteBuyList.prototype.activate = function (params) {
            debugger;
            if (params.List != null) {
                this.list = params.List;
            }
        };
        DeleteBuyList.prototype.deleteList = function () {
            var _this = this;
            this.processing = true;
            this.repo
                .deleteBuyList(this.list)
                .then(function (x) {
                _this.notification.success('Lista apagada com sucesso!');
                _this.list.status = buyListStatus_1.BuyListStatus.Inactive;
                _this.ea.publish('listDeleted', _this.list);
                _this.controller.ok();
                _this.processing = false;
            })
                .catch(function (e) {
                _this.notification.presentError(e);
                _this.processing = false;
            });
        };
        DeleteBuyList.prototype.cancel = function () {
            this.controller.cancel();
        };
        DeleteBuyList = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController,
                aurelia_event_aggregator_1.EventAggregator,
                notificationService_1.NotificationService,
                foodServiceRepository_1.FoodServiceRepository])
        ], DeleteBuyList);
        return DeleteBuyList;
    }());
    exports.DeleteBuyList = DeleteBuyList;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/cotacaoPedido',["require", "exports", "aurelia-api", "../../../repositories/productRepository", "../../../services/notificationService", "../../../services/identityService", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator"], function (require, exports, aurelia_api_1, productRepository_1, notificationService_1, identityService_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CotacaoPedido = (function () {
        function CotacaoPedido(router, service, nService, ea, config, repository) {
            this.router = router;
            this.service = service;
            this.nService = nService;
            this.ea = ea;
            this.config = config;
            this.repository = repository;
        }
        CotacaoPedido = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                identityService_1.IdentityService,
                notificationService_1.NotificationService,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_api_1.Config,
                productRepository_1.ProductRepository])
        ], CotacaoPedido);
        return CotacaoPedido;
    }());
    exports.CotacaoPedido = CotacaoPedido;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/selecaoDeProdutosFoodService',["require", "exports", "../../../repositories/productRepository", "../../../services/notificationService", "../../../services/identityService", "aurelia-framework", "aurelia-event-aggregator", "../../../repositories/foodServiceRepository", "../../../domain/foodServiceProduct"], function (require, exports, productRepository_1, notificationService_1, identityService_1, aurelia_framework_1, aurelia_event_aggregator_1, foodServiceRepository_1, foodServiceProduct_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelecaoDeProdutosFoodService = (function () {
        function SelecaoDeProdutosFoodService(service, nService, ea, productRepository, repository) {
            this.service = service;
            this.nService = nService;
            this.ea = ea;
            this.productRepository = productRepository;
            this.repository = repository;
            this.isFiltered = false;
            this.isProcessing = false;
        }
        SelecaoDeProdutosFoodService.prototype.attached = function () {
            var _this = this;
            this.loadData();
            this.ea.subscribe('productRemoved', function (x) {
                _this.allProducts.unshift(x.product);
                _this.search();
            });
        };
        SelecaoDeProdutosFoodService.prototype.updateCategory = function () {
            this.selectedCategory = this.selectedClass.categories[0];
            this.search();
        };
        SelecaoDeProdutosFoodService.prototype.loadData = function () {
            var _this = this;
            var promisse0 = this.productRepository
                .getAllClasses()
                .then(function (data) {
                _this.classes = data;
                _this.selectedClass = data[0];
                _this.selectedCategory = _this.selectedClass.categories[0];
            })
                .catch(function (e) { return _this.nService.presentError(e); });
            var promisse1 = this.productRepository
                .getAllProducts()
                .then(function (data) {
                _this.allProducts = data;
            })
                .catch(function (e) { return _this.nService.presentError(e); });
            Promise.all([promisse0, promisse1]).then(function () {
                _this.search();
                _this.ea.publish('dataLoaded');
            });
        };
        SelecaoDeProdutosFoodService.prototype.search = function () {
            var _this = this;
            if ((this.selectedCategory == null || this.selectedCategory.id == '') && (this.filter == null || this.filter == '')) {
                this.isFiltered = false;
            }
            else {
                this.isFiltered = true;
                this.filteredProducts = this.allProducts.filter(function (x) {
                    var isFound = true;
                    if ((_this.selectedCategory != null && _this.selectedCategory.id != '')) {
                        if (x.category.id == _this.selectedCategory.id) {
                            isFound = true;
                        }
                        else {
                            isFound = false;
                        }
                    }
                    if (isFound) {
                        if ((_this.filter != null && _this.filter != '')) {
                            if (x.name.toUpperCase().includes(_this.filter.toUpperCase())) {
                                isFound = true;
                            }
                            else {
                                isFound = false;
                            }
                        }
                    }
                    if (isFound) {
                        return x;
                    }
                });
            }
        };
        SelecaoDeProdutosFoodService.prototype.addProduct = function (product) {
            var _this = this;
            var user = this.service.getIdentity();
            product.isLoading = true;
            this.isProcessing = true;
            var foodProduct = new foodServiceProduct_1.FoodServiceProduct();
            foodProduct.product = product;
            foodProduct.isActive = true;
            this.isFiltered = true;
            this.repository
                .addProduct(foodProduct)
                .then(function (data) {
                _this.filteredProducts = _this.filteredProducts.filter(function (x) { return x.id != product.id; });
                _this.allProducts = _this.allProducts.filter(function (x) { return x.id != product.id; });
                _this.nService.presentSuccess('Produto incluído com sucesso!');
                _this.ea.publish('productAdded', data);
                _this.isProcessing = false;
                product.isLoading = true;
            }).catch(function (e) {
                _this.nService.presentError(e);
                _this.isProcessing = false;
                product.isLoading = true;
            });
        };
        SelecaoDeProdutosFoodService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [identityService_1.IdentityService,
                notificationService_1.NotificationService,
                aurelia_event_aggregator_1.EventAggregator,
                productRepository_1.ProductRepository,
                foodServiceRepository_1.FoodServiceRepository])
        ], SelecaoDeProdutosFoodService);
        return SelecaoDeProdutosFoodService;
    }());
    exports.SelecaoDeProdutosFoodService = SelecaoDeProdutosFoodService;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/listaDePrecos',["require", "exports", "../../../repositories/priceListRepository", "aurelia-api", "../../../services/notificationService", "../../../services/identityService", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator"], function (require, exports, priceListRepository_1, aurelia_api_1, notificationService_1, identityService_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListaDePrecos = (function () {
        function ListaDePrecos(router, service, nService, ea, config, repository) {
            this.router = router;
            this.service = service;
            this.nService = nService;
            this.ea = ea;
            this.config = config;
            this.repository = repository;
            this.lists = [];
        }
        ListaDePrecos.prototype.attached = function () {
            var _this = this;
            this.loadData();
            this.ea.subscribe('uploadSupplierProductFileDone', function (file) {
                _this.loadData();
            });
        };
        ListaDePrecos.prototype.loadData = function () {
            var _this = this;
            this.repository
                .getAll()
                .then(function (data) {
                _this.lists = data;
                _this.ea.publish('listaDePrecosLoaded');
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ListaDePrecos.prototype.downloadList = function (list) {
            var userId = this.service.getIdentity().id;
            var api = this.config.getEndpoint('csz');
            window.open(api.client.baseUrl + 'DownloadPriceList?userId=' + userId + '&listId=' + list.id, '_parent');
        };
        ListaDePrecos.prototype.dataAtualFormatada = function (date) {
            var dia = '', mes = '', ano = '';
            var data = (new Date(date));
            dia = data.getDate().toString();
            if (dia.toString().length == 1) {
                dia = "0" + dia;
            }
            var mes = (data.getMonth() + 1).toString();
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            var ano = data.getFullYear().toString();
            if (data.getHours() == 0) {
                return dia + "/" + mes + "/" + ano;
            }
            return dia + "/" + mes + "/" + ano + ' ' + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
        };
        ListaDePrecos = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                identityService_1.IdentityService,
                notificationService_1.NotificationService,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_api_1.Config,
                priceListRepository_1.PriceListRepository])
        ], ListaDePrecos);
        return ListaDePrecos;
    }());
    exports.ListaDePrecos = ListaDePrecos;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/baixaPedido',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "../../../services/notificationService", "../../../repositories/orderRepository", "../../../domain/order", "../../../domain/orderStatus", "../../../domain/evaluation", "../../../repositories/evaluationRepository"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, notificationService_1, orderRepository_1, order_1, orderStatus_1, evaluation_1, evaluationRepository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaixaPedido = (function () {
        function BaixaPedido(pController, ea, evalRepository, notification, orderRepo) {
            this.ea = ea;
            this.evalRepository = evalRepository;
            this.notification = notification;
            this.orderRepo = orderRepo;
            this.processing = false;
            this.controller = pController;
            this.order = new order_1.Order();
            this.evaluation = new evaluation_1.Evaluation();
        }
        BaixaPedido.prototype.activate = function (params) {
            if (params.Order != null) {
                this.order = params.Order;
                this.evaluation.order = this.order;
            }
        };
        BaixaPedido.prototype.acceptOrder = function () {
            var _this = this;
            this.processing = true;
            this.evalRepository
                .finishOrder(this.evaluation)
                .then(function (x) {
                _this.notification.success('Pedido baixado com sucesso!');
                _this.order.status = orderStatus_1.OrderStatus.Accepted;
                _this.controller.ok();
                _this.processing = false;
            })
                .catch(function (e) {
                _this.notification.presentError(e);
                _this.processing = false;
            });
        };
        BaixaPedido.prototype.setAvaliacao = function (nota) {
            this.notaAvaliacao = nota;
            this.evaluation.rating = nota;
        };
        BaixaPedido.prototype.cancel = function () {
            this.controller.cancel();
        };
        BaixaPedido = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController,
                aurelia_event_aggregator_1.EventAggregator,
                evaluationRepository_1.EvaluationRepository,
                notificationService_1.NotificationService,
                orderRepository_1.OrderRepository])
        ], BaixaPedido);
        return BaixaPedido;
    }());
    exports.BaixaPedido = BaixaPedido;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/observacoesPedido',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "aurelia-validation", "../../../services/notificationService"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, aurelia_validation_1, notificationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObservacoesPedido = (function () {
        function ObservacoesPedido(pController, ea, validationControllerFactory, notification) {
            this.ea = ea;
            this.validationControllerFactory = validationControllerFactory;
            this.notification = notification;
            this.controller = pController;
        }
        ObservacoesPedido.prototype.activate = function (params) {
            if (params.Quote != null) {
                this.selectedQuote = params.Quote;
            }
        };
        ObservacoesPedido.prototype.confirmOrder = function () {
            this.controller.ok(this.selectedQuote);
        };
        ObservacoesPedido.prototype.cancel = function () {
            this.controller.cancel();
        };
        ObservacoesPedido = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_validation_1.ValidationControllerFactory,
                notificationService_1.NotificationService])
        ], ObservacoesPedido);
        return ObservacoesPedido;
    }());
    exports.ObservacoesPedido = ObservacoesPedido;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/selecaoDeProdutos',["require", "exports", "../../../repositories/productRepository", "../../../services/notificationService", "aurelia-framework", "aurelia-event-aggregator", "../../../repositories/supplierRepository", "../../../domain/supplierProduct", "../../../domain/SupplierProductStatus"], function (require, exports, productRepository_1, notificationService_1, aurelia_framework_1, aurelia_event_aggregator_1, supplierRepository_1, supplierProduct_1, SupplierProductStatus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelecaoDeProdutos = (function () {
        function SelecaoDeProdutos(nService, ea, productRepository, repository) {
            this.nService = nService;
            this.ea = ea;
            this.productRepository = productRepository;
            this.repository = repository;
            this.isFiltered = true;
            this.isLoaded = false;
        }
        SelecaoDeProdutos.prototype.attached = function () {
            var _this = this;
            this.loadData();
            this.ea.subscribe('supplierProductRemoved', function (product) {
                if (_this.selectedCategory.id == product.product.category.id) {
                    _this.loadProducts();
                }
            });
        };
        SelecaoDeProdutos.prototype.loadData = function () {
            var _this = this;
            this.productRepository
                .getAllClasses()
                .then(function (data) {
                _this.classes = data;
                _this.selectedClass = data[0];
                _this.selectedCategory = data[0].categories[0];
                _this.loadProducts();
                _this.ea.publish('selecaoDeProdutosLoaded');
                _this.isLoaded = true;
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        SelecaoDeProdutos.prototype.loadProducts = function () {
            var _this = this;
            this.isLoaded = false;
            this.allProducts = [];
            this.filteredProducts = [];
            if (this.selectedCategory != null) {
                return this.productRepository
                    .getOfferedProducts(this.selectedCategory.id)
                    .then(function (data) {
                    _this.allProducts = data;
                    _this.filteredProducts = data;
                    _this.isLoaded = true;
                }).catch(function (e) {
                    _this.nService.presentError(e);
                    _this.isLoaded = true;
                });
            }
        };
        SelecaoDeProdutos.prototype.updateCategories = function () {
            this.selectedCategory = this.selectedClass.categories[0];
            this.loadProducts();
        };
        SelecaoDeProdutos.prototype.search = function () {
            var _this = this;
            if ((this.selectedCategory == null || this.selectedCategory.id == '') && (this.filter == null || this.filter == '')) {
                this.isFiltered = false;
            }
            else {
                this.isFiltered = true;
                this.filteredProducts = this.allProducts.filter(function (x) {
                    var isFound = true;
                    if ((_this.selectedCategory != null && _this.selectedCategory.id != '')) {
                        if (x.category.id == _this.selectedCategory.id) {
                            isFound = true;
                        }
                        else {
                            isFound = false;
                        }
                    }
                    if (isFound) {
                        if ((_this.filter != null && _this.filter != '')) {
                            if (x.name.toUpperCase().includes(_this.filter.toUpperCase())) {
                                isFound = true;
                            }
                            else {
                                isFound = false;
                            }
                        }
                    }
                    if (isFound) {
                        return x;
                    }
                });
            }
        };
        SelecaoDeProdutos.prototype.includeProduct = function (product) {
            var supplierProduct = new supplierProduct_1.SupplierProduct();
            supplierProduct.product = product;
            supplierProduct.status = SupplierProductStatus_1.SupplierProductStatus.Active;
            this.isFiltered = true;
            product.supplierProduct = supplierProduct;
            this.isEditing = true;
        };
        SelecaoDeProdutos.prototype.saveProduct = function (product) {
            var _this = this;
            var supplierProduct = product.supplierProduct;
            product.supplierProduct = null;
            supplierProduct.status = SupplierProductStatus_1.SupplierProductStatus.Active;
            this.isFiltered = true;
            product.isLoading = true;
            this.repository
                .addProduct(supplierProduct)
                .then(function (data) {
                _this.allProducts = _this.allProducts.filter(function (x) { return x.id != product.id; });
                _this.filteredProducts = _this.filteredProducts.filter(function (x) { return x.id != product.id; });
                _this.nService.presentSuccess('Produto incluído com sucesso!');
                _this.ea.publish('productAdded', data);
                product.isLoading = false;
                _this.isEditing = false;
            }).catch(function (e) {
                _this.nService.presentError(e);
                product.isLoading = false;
            });
        };
        SelecaoDeProdutos = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [notificationService_1.NotificationService,
                aurelia_event_aggregator_1.EventAggregator,
                productRepository_1.ProductRepository,
                supplierRepository_1.SupplierRepository])
        ], SelecaoDeProdutos);
        return SelecaoDeProdutos;
    }());
    exports.SelecaoDeProdutos = SelecaoDeProdutos;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/rejeicaoPedido',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "aurelia-validation", "../../../services/notificationService", "../../../repositories/orderRepository", "../../formValidationRenderer", "../../../domain/order", "../../../domain/orderStatus", "../../../domain/rejectOrderViewModel"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, aurelia_validation_1, notificationService_1, orderRepository_1, formValidationRenderer_1, order_1, orderStatus_1, rejectOrderViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RejeicaoPedido = (function () {
        function RejeicaoPedido(pController, ea, validationControllerFactory, notification, orderRepo) {
            this.ea = ea;
            this.validationControllerFactory = validationControllerFactory;
            this.notification = notification;
            this.orderRepo = orderRepo;
            this.controller = pController;
            this.order = new order_1.Order();
            this.vm = new rejectOrderViewModel_1.RejectOrderViewModel();
            this.processing = false;
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new formValidationRenderer_1.FormValidationRenderer());
            this.validationController.validateTrigger = aurelia_validation_1.validateTrigger.blur;
            this.validationController.addObject(this.vm);
        }
        RejeicaoPedido.prototype.activate = function (params) {
            if (params.Order != null) {
                this.order = params.Order;
                this.vm.orderId = this.order.id;
            }
            aurelia_validation_1.ValidationRules
                .ensure(function (vm) { return vm.orderId; }).displayName('Código do pedido').required()
                .ensure(function (vm) { return vm.reason; }).displayName('Motivo da Rejeição').required()
                .on(this.vm);
        };
        RejeicaoPedido.prototype.rejectOrder = function () {
            var _this = this;
            this.validationController
                .validate()
                .then(function (result) {
                if (result.valid) {
                    _this.processing = true;
                    _this.orderRepo
                        .rejectOrder(_this.vm)
                        .then(function (x) {
                        _this.processing = false;
                        _this.notification.success('Pedido rejeitado com sucesso!');
                        _this.ea.publish('orderRejected', _this.order);
                        _this.order.status = orderStatus_1.OrderStatus.Rejected;
                        _this.controller.ok();
                    })
                        .catch(function (e) {
                        _this.processing = false;
                        _this.notification.presentError(e);
                    });
                }
                else {
                    _this.processing = false;
                    _this.notification.error('Erros de validação foram encontrados');
                }
            });
        };
        RejeicaoPedido.prototype.cancel = function () {
            this.controller.cancel();
        };
        RejeicaoPedido = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_validation_1.ValidationControllerFactory,
                notificationService_1.NotificationService,
                orderRepository_1.OrderRepository])
        ], RejeicaoPedido);
        return RejeicaoPedido;
    }());
    exports.RejeicaoPedido = RejeicaoPedido;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/horarioDeEntregaPedido',["require", "exports", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "aurelia-validation", "../../../services/notificationService", "../../formValidationRenderer", "../../../domain/confirmScheduleOrderViewModel", "../../../repositories/deliveryRuleRepository", "../../../domain/deliveryRule"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, aurelia_validation_1, notificationService_1, formValidationRenderer_1, confirmScheduleOrderViewModel_1, deliveryRuleRepository_1, deliveryRule_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HorarioDeEntregaPedido = (function () {
        function HorarioDeEntregaPedido(pController, ea, validationControllerFactory, notification, repository) {
            this.ea = ea;
            this.validationControllerFactory = validationControllerFactory;
            this.notification = notification;
            this.repository = repository;
            this.controller = pController;
            this.vm = new confirmScheduleOrderViewModel_1.ConfirmScheduleOrderViewModel();
            this.validationController = this.validationControllerFactory.createForCurrentScope();
            this.validationController.addRenderer(new formValidationRenderer_1.FormValidationRenderer());
            this.validationController.validateTrigger = aurelia_validation_1.validateTrigger.blur;
            this.validationController.addObject(this.vm);
        }
        HorarioDeEntregaPedido.prototype.activate = function (params) {
            var _this = this;
            if (params.Quote != null) {
                this.selectedQuote = params.Quote;
            }
            this.repository
                .getRule(this.selectedQuote.productClass.id)
                .then(function (x) {
                if (x != null) {
                    _this.deliveryRule = x;
                    _this.vm.deliveryScheduleStart = x.deliveryScheduleInitial;
                    _this.vm.deliveryScheduleEnd = x.deliveryScheduleFinal;
                    _this.vm.deliveryDate = deliveryRule_1.DeliveryRule.getNextDeliveryDate(_this.deliveryRule);
                }
            })
                .catch(function (e) { return _this.notification.presentError(e); });
            aurelia_validation_1.ValidationRules
                .ensure(function (vm) { return vm.deliveryScheduleStart; }).displayName('Horário inicial').required()
                .ensure(function (vm) { return vm.deliveryScheduleEnd; }).displayName('Horário final').required()
                .ensure(function (vm) { return vm.deliveryDate; }).displayName('Data de entrega').required()
                .on(this.vm);
            aurelia_validation_1.ValidationRules
                .ensureObject()
                .satisfies(function (obj) { return _this.vm.deliveryScheduleStart < _this.vm.deliveryScheduleEnd; })
                .withMessage('O horario inicial deve ser menor que o horário final')
                .on(this.vm);
        };
        HorarioDeEntregaPedido.prototype.confirmSchedule = function () {
            var _this = this;
            this.validationController
                .validate()
                .then(function (result) {
                if (result.valid) {
                    _this.controller.ok(_this.vm);
                }
                else {
                    _this.notification.error('Erros de validação foram encontrados');
                }
            });
        };
        HorarioDeEntregaPedido.prototype.cancel = function () {
            this.controller.cancel();
        };
        HorarioDeEntregaPedido = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_validation_1.ValidationControllerFactory,
                notificationService_1.NotificationService,
                deliveryRuleRepository_1.DeliveryRuleRepository])
        ], HorarioDeEntregaPedido);
        return HorarioDeEntregaPedido;
    }());
    exports.HorarioDeEntregaPedido = HorarioDeEntregaPedido;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/historicoDeImportacao',["require", "exports", "aurelia-api", "../../../repositories/productRepository", "../../../services/notificationService", "../../../services/identityService", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator"], function (require, exports, aurelia_api_1, productRepository_1, notificationService_1, identityService_1, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HistoricoDeImportacao = (function () {
        function HistoricoDeImportacao(router, service, nService, ea, config, repository) {
            this.router = router;
            this.service = service;
            this.nService = nService;
            this.ea = ea;
            this.config = config;
            this.repository = repository;
            this.files = [];
        }
        HistoricoDeImportacao.prototype.attached = function () {
            var _this = this;
            this.loadData();
            this.ea.subscribe('uploadSupplierProductFileDone', function (file) {
                if (file != null) {
                    _this.files.unshift(file);
                }
            });
        };
        HistoricoDeImportacao.prototype.loadData = function () {
            var _this = this;
            this.repository
                .getAllSuplierProductFiles()
                .then(function (data) {
                _this.files = data;
                _this.ea.publish('historicoDeImportacaoLoaded');
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        HistoricoDeImportacao.prototype.dataAtualFormatada = function (date) {
            var dia = '', mes = '', ano = '';
            var data = (new Date(date));
            dia = data.getDate().toString();
            if (dia.toString().length == 1) {
                dia = "0" + dia;
            }
            var mes = (data.getMonth() + 1).toString();
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            var ano = data.getFullYear().toString();
            if (data.getHours() == 0) {
                return dia + "/" + mes + "/" + ano;
            }
            return dia + "/" + mes + "/" + ano + ' ' + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
        };
        HistoricoDeImportacao = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                identityService_1.IdentityService,
                notificationService_1.NotificationService,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_api_1.Config,
                productRepository_1.ProductRepository])
        ], HistoricoDeImportacao);
        return HistoricoDeImportacao;
    }());
    exports.HistoricoDeImportacao = HistoricoDeImportacao;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('views/components/partials/produtosSelecionados',["require", "exports", "../../../repositories/productRepository", "../../../services/notificationService", "../../../domain/productCategory", "aurelia-framework", "aurelia-dialog", "aurelia-event-aggregator", "../../../repositories/foodServiceRepository", "../../../domain/buyList", "../../../domain/buyListProduct", "../../../domain/alterBuyListProductViewModel", "../../components/partials/deleteBuyList", "../../../domain/buyListStatus"], function (require, exports, productRepository_1, notificationService_1, productCategory_1, aurelia_framework_1, aurelia_dialog_1, aurelia_event_aggregator_1, foodServiceRepository_1, buyList_1, buyListProduct_1, alterBuyListProductViewModel_1, deleteBuyList_1, buyListStatus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProdutosSelecionados = (function () {
        function ProdutosSelecionados(dialogService, nService, ea, productRepository, repository) {
            this.dialogService = dialogService;
            this.nService = nService;
            this.ea = ea;
            this.productRepository = productRepository;
            this.repository = repository;
            this.isFiltered = false;
            this.isCreatingList = false;
            this.filteredProducts = [];
            this.lists = [];
        }
        ProdutosSelecionados.prototype.attached = function () {
            var _this = this;
            this.loadData();
            this.ea.subscribe('productAdded', function (product) {
                product.isNew = true;
                if ((_this.selectedClass.id == product.product.category.productClass.id && (_this.selectedCategory.id == '-1' || _this.selectedCategory.id == '-2'))
                    || _this.selectedCategory.id == product.product.category.id) {
                    if (_this.selectedCategory.id == '-1' || _this.selectedCategory.id == '-2' || _this.selectedCategory.id == '' || _this.selectedCategory == null) {
                        _this.isFiltered = true;
                        _this.filteredProducts.unshift(product);
                        _this.allProducts.unshift(product);
                        _this.lists.forEach(function (x) {
                            var foodProduct = x.products.filter(function (x) { return x.foodServiceProduct.productId == product.productId; });
                            if (foodProduct == null) {
                                var item = new buyListProduct_1.BuyListProduct();
                                item.foodServiceProduct = product;
                                item.isInList = false;
                                x.products.unshift(item);
                            }
                            else {
                                foodProduct[0].foodServiceProduct.isActive = true;
                            }
                        });
                    }
                    else {
                        _this.allProducts.unshift(product);
                    }
                }
                else {
                    _this.allProducts.unshift(product);
                }
            });
        };
        ProdutosSelecionados.prototype.updateCategories = function () {
            this.selectedCategory = this.selectedClass.categories[0];
            this.defineCurrentLists();
            this.defineProductsInList();
            this.search();
        };
        ProdutosSelecionados.prototype.loadData = function () {
            var _this = this;
            this.productRepository
                .getAllClasses()
                .then(function (data) {
                _this.classes = data;
                data.forEach(function (x) {
                    var novo = new productCategory_1.ProductCategory();
                    novo.id = '-2';
                    novo.name = "Todos";
                    x.categories.unshift(novo);
                    var novo = new productCategory_1.ProductCategory();
                    novo.id = '-1';
                    novo.name = "Novos Produtos";
                    x.categories.unshift(novo);
                    _this.selectedCategory = novo;
                });
                _this.selectedClass = data[0];
                _this.selectedCategory = _this.selectedClass.categories[0];
                _this.loadProducts();
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ProdutosSelecionados.prototype.loadProducts = function () {
            var _this = this;
            this.repository
                .getProducts()
                .then(function (data) {
                _this.allProducts = data;
                _this.loadBuyLists();
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ProdutosSelecionados.prototype.loadBuyLists = function () {
            var _this = this;
            this.repository
                .getLists()
                .then(function (data) {
                _this.allLists = data;
                _this.defineCurrentLists();
                _this.defineProductsInList();
                _this.search();
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ProdutosSelecionados.prototype.defineCurrentLists = function () {
            var _this = this;
            this.lists = this.allLists.filter(function (x) { return x.productClass.id == _this.selectedClass.id; });
        };
        ProdutosSelecionados.prototype.defineProductsInList = function () {
            this.lists.forEach(function (y) {
                y.products.forEach(function (z) {
                    if (z.foodServiceProduct != null) {
                        y[z.foodServiceProduct.product.name + '_' + z.foodServiceProduct.product.unit.name + '_' + z.foodServiceProduct.product.description] = z.isInList;
                    }
                });
            });
        };
        ProdutosSelecionados.prototype.search = function () {
            var _this = this;
            this.isFiltered = true;
            var products = this.allProducts.filter(function (x) { return x.product.category.productClass.id == _this.selectedClass.id; });
            if (this.selectedCategory != null && this.selectedCategory.id == '-2') {
                this.filteredProducts = products;
            }
            this.filteredProducts = products.filter(function (x) {
                var isFound = true;
                if (_this.selectedCategory.id == '-1') {
                    return x.isNew != null && x.isNew == true;
                }
                else {
                    if ((_this.selectedCategory != null && _this.selectedCategory.id != '' && _this.selectedCategory.id != '-2')) {
                        if (x.product.category.id == _this.selectedCategory.id) {
                            isFound = true;
                        }
                        else {
                            isFound = false;
                        }
                    }
                    if (isFound) {
                        if ((_this.filter != null && _this.filter != '')) {
                            if (x.product.name.toUpperCase().includes(_this.filter.toUpperCase())) {
                                isFound = true;
                            }
                            else {
                                isFound = false;
                            }
                        }
                    }
                    if (isFound) {
                        return x;
                    }
                }
            });
        };
        ProdutosSelecionados.prototype.addProduct = function (product) {
            this.allProducts = this.allProducts.filter(function (x) {
                if (x.product.id != product.id)
                    return x;
            });
            this.filteredProducts = this.filteredProducts.filter(function (x) {
                if (x.product.id != product.id)
                    return x;
            });
            this.ea.publish('productAdded', product);
        };
        ProdutosSelecionados.prototype.createList = function () {
            var _this = this;
            if (this.newListName != null && this.newListName != '') {
                var buyList = new buyList_1.BuyList();
                buyList.name = this.newListName;
                buyList.productClass = this.selectedClass;
                this.repository
                    .addBuyList(buyList)
                    .then(function (data) {
                    _this.lists.unshift(data);
                    _this.newListName = '';
                    _this.nService.presentSuccess('Lista criada com sucesso!');
                }).catch(function (e) {
                    _this.nService.presentError(e);
                });
            }
        };
        ProdutosSelecionados.prototype.changeList = function (list, product) {
            var _this = this;
            var viewModel = new alterBuyListProductViewModel_1.AlterBuyListProductViewModel();
            viewModel.isInList = list[product.product.name + '_' + product.product.unit.name + '_' + product.product.description];
            viewModel.foodServiceProductId = product.productId;
            viewModel.buyListId = list.id;
            this.repository
                .alterBuyList(viewModel)
                .then(function (data) {
                _this.nService.presentSuccess('Lista atualizada com sucesso!');
            }).catch(function (e) {
                _this.nService.presentError(e);
            });
        };
        ProdutosSelecionados.prototype.removeProduct = function (product) {
            var _this = this;
            product.isLoading = true;
            this.isProcessing = true;
            this.repository
                .inativateProduct(product)
                .then(function (data) {
                _this.allProducts = _this.allProducts.filter(function (x) { return x.productId != product.productId; });
                _this.filteredProducts = _this.filteredProducts.filter(function (x) { return x.productId != product.productId; });
                product.isActive = false;
                _this.ea.publish('productRemoved', product);
                _this.nService.presentSuccess('Produto removido  com sucesso!');
                _this.isProcessing = false;
                product.isLoading = true;
            }).catch(function (e) {
                _this.nService.presentError(e);
                _this.isProcessing = false;
                product.isLoading = true;
            });
        };
        ProdutosSelecionados.prototype.deleteList = function (list) {
            var params = { List: list };
            this.dialogService
                .open({ viewModel: deleteBuyList_1.DeleteBuyList, model: params, lock: false })
                .whenClosed(function (response) {
                if (response.wasCancelled) {
                    return;
                }
                list.status = buyListStatus_1.BuyListStatus.Inactive;
            });
        };
        ProdutosSelecionados = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogService,
                notificationService_1.NotificationService,
                aurelia_event_aggregator_1.EventAggregator,
                productRepository_1.ProductRepository,
                foodServiceRepository_1.FoodServiceRepository])
        ], ProdutosSelecionados);
        return ProdutosSelecionados;
    }());
    exports.ProdutosSelecionados = ProdutosSelecionados;
});



define('text!app.html', ['module'], function(module) { module.exports = "<template><div class=\"container-fluid\"><router-view containerless></router-view></div></template>"; });
define('text!views/cadastro.html', ['module'], function(module) { module.exports = "<template><require from=\"./components/attributes/cnpjMask\"></require><require from=\"./components/attributes/cepMask\"></require><require from=\"./components/attributes/phoneWithDDDMask\"></require><require from=\"./components/attributes/cellPhoneWithDDDMask\"></require><require from=\"./components/attributes/inscricaoEstadualMask\"></require><require from=\"./components/valueConverters/cnpjValueConverter\"></require><require from=\"./components/valueConverters/cepValueConverter\"></require><require from=\"./components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"./components/valueConverters/cellPhoneWithDDDValueConverter\"></require><require from=\"./components/valueConverters/inscricaoEstadualValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Cadastro de Fornecedor<div class=\"progress\"><div class=\"progress-bar progress-bar-sm bg-gradient\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:0%\"></div></div></div><div class=\"card-form-wizard\"><div class=\"row\"><div class=\"col-lg-12\"><div id=\"rootwizard-1\"><ul class=\"nav nav-pills\"><li><a href=\"#tab1\" data-toggle=\"tab\"><span class=\"main-text\"><span class=\"h3\">1. Dados Básicos</span></span></a></li><li><a href=\"#tab2\" data-toggle=\"tab\"><span class=\"main-text\"><span class=\"h3\">2. Endereço</span> <small>No validation required</small></span></a></li><li><a href=\"#tab3\" data-toggle=\"tab\"><span class=\"main-text\"><span class=\"h3\">3. Contatos</span></span></a></li></ul><div class=\"tab-content clearfix\"><div class=\"tab-pane\" id=\"tab1\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Razão Social *</label> <input type=\"text\" class=\"form-control disabled\" disabled=\"disabled\" value.bind=\"supplier.name\"></div><div class=\"form-group\"><label class=\"control-label\">CNPJ *</label> <input type=\"text\" class=\"form-control disabled\" disabled=\"disabled\" cnpj value.bind=\"supplier.cnpj | cnpj  \"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome Fantasia *</label> <input type=\"text\" class=\"form-control disabled\" disabled=\"disabled\" value.bind=\"supplier.fantasyName\"></div><div class=\"form-group\"><label class=\"control-label\">Inscrição Estadual *</label> <input type=\"text\" class=\"form-control disabled\" disabled=\"disabled\" inscricaoestadual value.bind=\"supplier.inscricaoEstadual | inscricaoEstadual\"></div></div></div></div><div class=\"tab-pane\" id=\"tab2\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">CEP</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isCepInvalid  ? 'border-danger' : '' } \" cep value.bind=\"supplier.address.cep | cep\" change.delegate=\"consultaCEP()\"></div></div></div><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Logradouro</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isLogradouroInvalid  ? 'border-danger' : '' } \" value.bind=\"supplier.address.logradouro\" change.delegate=\"validator.addressValidator.validateLogradouro()\"></div><div class=\"form-group\"><label class=\"control-label\">Bairro</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isNeighborhoodInvalid  ? 'border-danger' : '' } \" value.bind=\"supplier.address.neighborhood\" change.delegate=\"validator.addressValidator.validateNeighborhood()\"></div><div class=\"form-group\"><label class=\"control-label\">Estado</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isStateInvalid  ? 'border-danger' : '' } \" value.bind=\"supplier.address.state\" change.delegate=\"validator.addressValidator.validateState()\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Número</label> <input type=\"number\" class=\"form-control ${validator.addressValidator.isNumberInvalid  ? 'border-danger' : '' }\" value.bind=\"supplier.address.number\" change.delegate=\"validator.addressValidator.validateNumber()\"></div><div class=\"form-group\"><label class=\"control-label\">Cidade</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isCityInvalid  ? 'border-danger' : '' }\" value.bind=\"supplier.address.city\" change.delegate=\"validator.addressValidator.validateCity()\"></div><div class=\"form-group\"><label class=\"control-label\">Complemento</label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.address.complement\"></div></div></div></div><div class=\"tab-pane\" id=\"tab3\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isNameInvalid  ? 'border-danger' : '' }\" value.bind=\"supplier.contact.name\" change.delegate=\"validator.contactValidator.validateName()\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Comercial</label> <input type=\"text\" class=\"form-control\" phone-with-ddd value.bind=\"supplier.contact.commercialPhone | phoneWithDDD\" placeholder=\"(01) 1234-5678\"></div><div class=\"form-group\"><label class=\"control-label\">E-mail</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isEmailInvalid  ? 'border-danger' : '' } \" value.bind=\"supplier.contact.email\" change.delegate=\"validator.contactValidator.validateEmail()\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Telefone</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isPhoneInvalid  ? 'border-danger' : '' } \" phone-with-ddd value.bind=\"supplier.contact.phone | phoneWithDDD\" change.delegate=\"validator.contactValidator.validatePhone()\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Celular</label> <input type=\"text\" class=\"form-control\" cell-phone-with-ddd value.bind=\"supplier.contact.personalPhone | cellPhoneWithDDD\" placeholder=\"(01) 01234-5678\"></div></div></div></div><ul class=\"pager wizard\"><li class=\"previous\"><a href=\"#\" class=\"waves-effect waves-light\" click.trigger=\"back()\">Voltar</a></li><li class=\"next\" if.bind=\"currentStep < totalSteps\"><a href=\"#\" class=\"waves-effect waves-light\" click.trigger=\"advance()\">Avançar</a></li><li class=\"finish float-right\" if.bind=\"currentStep == totalSteps\"><button type=\"button\" if.bind=\"! isLoading\" class=\"btn btn-primary btn-gradient assign-task waves-effect waves-light\" click.trigger=\"save()\"><span class=\"gradient\">Salvar</span></button><div class=\"fa-2x text-center\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></li></ul></div></div></div></div></div></div></div></div></template>"; });
define('text!views/master.html', ['module'], function(module) { module.exports = "<template><div><div class=\"row\"><nav id=\"sidebar\" class=\"px-0 bg-dark bg-gradient sidebar\"><ul class=\"nav nav-pills flex-column\" if.bind=\"identity.type == 0\"><li class=\"logo-nav-item\"><a class=\"navbar-brand\"><img src=\"assets/img/logo-white.png\" width=\"145\" height=\"32.3\" alt=\"QuillPro\" class=\"mCS_img_loaded\" style=\"width:150px;height:85px;margin-left:5px\"></a></li><li><h6 class=\"nav-header\">Geral</h6></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/dashboard\"><i class=\"batch-icon batch-icon-browser-alt\"></i> Dashboard <span class=\"sr-only\">(current)</span></a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/cadastro\"><i class=\"batch-icon batch-icon-list-alt\"></i>Cadastro</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/regrasDeMercado\"><i class=\"batch-icon batch-icon-star\"></i> Regras de Mercado</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/produtos\"><i class=\"batch-icon batch-icon-layout-content-left\"></i> Produtos</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/clientes\"><i class=\"batch-icon batch-icon-users\"></i>Clientes <span class=\"badge badge-danger float-right ml-2 mr-2\" if.bind=\"novoFoodServices.length > 0 && ! isloadingFoodServices\">${novoFoodServices.length}</span><span class=\"badge badge-warning float-right ml-2 mr-2\" if.bind=\"waitingFoodServices.length > 0 && ! isloadingFoodServices\">${waitingFoodServices.length}</span><span class=\"float-right\" if.bind=\"isloadingFoodServices\"><i class=\"fa fa-refresh fa-spin\"></i></span></a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/pedidosFornecedor\"><i class=\"batch-icon batch-icon-layout-center-column\"></i>Pedidos <span class=\"badge badge-warning float-right ml-2 mr-2\" if.bind=\"acceptedOrdersCount > 0 && ! isLoadingOrders\">${acceptedOrdersCount}</span><span class=\"badge badge-danger float-right ml-2 mr-2\" if.bind=\"newOrdersCount > 0 && ! isLoadingOrders\">${newOrdersCount}</span><span class=\"float-right\" if.bind=\"isLoadingOrders\"><i class=\"fa fa-refresh fa-spin\"></i></span></a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/avaliacoesFornecedor\"><i class=\"batch-icon batch-icon-star\"></i> Avaliações</a></li></ul><ul class=\"nav nav-pills flex-column\" if.bind=\"identity.type == 1\"><li class=\"logo-nav-item\"><a class=\"navbar-brand\"><img src=\"assets/img/logo-white.png\" width=\"145\" height=\"32.3\" alt=\"QuillPro\" class=\"mCS_img_loaded\" style=\"width:150px;height:85px;margin-left:5px\"></a></li><li><h6 class=\"nav-header\">Geral</h6></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/dashboardFoodService\"><i class=\"batch-icon batch-icon-browser-alt\"></i> Dashboard <span class=\"sr-only\">(current)</span></a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/cadastroFoodService\"><i class=\"batch-icon batch-icon-list-alt\"></i>Cadastro</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/Fornecedores\"><i class=\"batch-icon batch-icon-users\"></i>Fornecedores</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/regraDeEntrega\"><i class=\"batch-icon batch-icon-star\"></i> Regras de entrega</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/meusProdutos\"><i class=\"batch-icon batch-icon-layout-center-column\"></i>Produtos</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/cotacao\"><i class=\"batch-icon batch-icon-layout-center-column\"></i>Cotação</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/pedidosFoodService\"><i class=\"batch-icon batch-icon-layout-center-column\"></i>Pedidos <span class=\"badge badge-warning float-right ml-2 mr-2\" if.bind=\"acceptedOrdersCount > 0 && ! isLoadingOrders\">${acceptedOrdersCount}</span><span class=\"badge badge-success float-right ml-2 mr-2\" if.bind=\"newOrdersCount > 0  && ! isLoadingOrders\">${newOrdersCount}</span><span class=\"float-right\" if.bind=\"isLoadingOrders\"><i class=\"fa fa-refresh fa-spin\"></i></span></a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/avaliacoesFoodService\"><i class=\"batch-icon batch-icon-star\"></i> Avaliações</a></li></ul><ul class=\"nav nav-pills flex-column\" if.bind=\"identity.type == 2\"><li class=\"logo-nav-item\"><a class=\"navbar-brand\"><img src=\"assets/img/logo-white.png\" width=\"145\" height=\"32.3\" alt=\"QuillPro\" class=\"mCS_img_loaded\" style=\"width:150px;height:85px;margin-left:5px\"></a></li><li><h6 class=\"nav-header\">Geral</h6></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/dashboard\"><i class=\"batch-icon batch-icon-browser-alt\"></i> Dashboard <span class=\"sr-only\">(current)</span></a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/mercadosAdmin\"><i class=\"batch-icon batch-icon-list-alt\"></i>Mercados</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/produtosAdmin\"><i class=\"batch-icon batch-icon-list-alt\"></i>Produtos</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/suppliersAdmin\"><i class=\"batch-icon batch-icon-star\"></i> Fornecedores</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/foodServicesAdmin\"><i class=\"batch-icon batch-icon-layout-content-left\"></i> Foodservices</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/avaliacoes\"><i class=\"batch-icon batch-icon-star\"></i> Avaliações</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"/#/csz/financeiro\"><i class=\"batch-icon batch-icon-layout-center-column\"></i>Financeiro</a></li></ul></nav><div class=\"right-column\"><nav class=\"navbar navbar-expand-lg navbar-light bg-white\"><button class=\"hamburger hamburger--slider\" type=\"button\" data-target=\".sidebar\" aria-controls=\"sidebar\" aria-expanded=\"false\" aria-label=\"Toggle Sidebar\"><span class=\"hamburger-box\"><span class=\"hamburger-inner\"></span></span></button><div class=\"navbar-collapse\" id=\"navbar-header-content\"><ul class=\"navbar-nav navbar-language-translation mr-auto\"></ul><ul class=\"navbar-nav navbar-notifications float-right\"><li class=\"nav-item dropdown\"><ul class=\"dropdown-menu dropdown-menu-fullscreen\" aria-labelledby=\"navbar-notification-search\"><li><form class=\"form-inline my-2 my-lg-0 no-waves-effect\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" placeholder=\"Search for...\"> <span class=\"input-group-btn\"><button class=\"btn btn-primary btn-gradient waves-effect waves-light\" type=\"button\">Search</button></span></div></form></li></ul></li><li class=\"nav-item dropdown\"><a class=\"nav-link dropdown-toggle no-waves-effect\" id=\"navbar-notification-misc\" click.trigger=\"updateNotifications()\" data-toggle=\"dropdown\" data-flip=\"false\" aria-haspopup=\"true\" aria-expanded=\"false\"><i class=\"batch-icon batch-icon-bell\"></i> <span class=\"notification-number\" if.bind=\"unSeenCount > 0\">${unSeenCount}</span></a><ul class=\"dropdown-menu dropdown-menu-right dropdown-menu-md\" aria-labelledby=\"navbar-notification-misc\"><li class=\"media\" repeat.for=\"notification of notifications\"><a><i class=\"batch-icon batch-icon-bell batch-icon-xl d-flex mr-3\"></i><div class=\"media-body\"><h6 class=\"mt-0 mb-1 notification-heading\">${notification.title}</h6><div class=\"notification-text\"> ${notification.message} </div></div></a></li></ul></li></ul><ul class=\"navbar-nav ml-5 navbar-profile\"><li class=\"nav-item dropdown\"><a class=\"nav-link dropdown-toggle\" id=\"navbar-dropdown-navbar-profile\" data-toggle=\"dropdown\" data-flip=\"false\" aria-haspopup=\"true\" aria-expanded=\"false\"><div class=\"profile-name\"> ${identity.name} </div><div class=\"profile-picture bg-gradient bg-primary has-message float-right\"><img src=\"assets/img/profile-pic.jpg\" width=\"44\" height=\"44\"></div></a><ul class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbar-dropdown-navbar-profile\"><li><a class=\"dropdown-item\" href=\"#\" click.trigger=\"logout()\">Logout</a></li></ul></li></ul></div></nav><div class=\"${ isLoading ? 'invisible' : '' }\"><main class=\"main-content p-5\" role=\"main\"><router-view containerless></router-view></main></div><div class=\"fa-5x ${  isLoading  ? '' : 'invisible'}\" style=\"position:fixed;top:40%;left:50%\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></template>"; });
define('text!views/login.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"right-column sisu\"><div class=\"row mx-0\"><div class=\"col-md-7 order-md-2 signin-right-column px-5 bg-dark\"><a class=\"signin-logo d-sm-block d-md-none\" href=\"#\"><img src=\"assets/img/logo-white.png\" width=\"145\" height=\"32.3\" alt=\"QuillPro\"></a><h1 class=\"display-4\">CSZ Compras Inteligentes</h1><p class=\"lead mb-5\">Olá, seja bem-vindo</p></div><div class=\"col-md-5 order-md-1 signin-left-column bg-white px-5\"><a class=\"signin-logo d-sm-none d-md-block\" style=\"margin-left:10%\"><img class=\"ml-5\" src=\"assets/img/logo2T.png\" style=\"cursor:default\" width=\"150\" height=\"92\" alt=\"CSZ\"></a><form><div class=\"form-group\"><label for=\"exampleInputEmail1\">Email</label> <input type=\"email\" class=\"form-control\" id=\"exampleInputEmail1\" value.bind=\"credential.email\" aria-describedby=\"emailHelp\" placeholder=\"Enter email\"></div><div class=\"form-group\"><label for=\"exampleInputPassword1\">Senha</label> <input type=\"password\" class=\"form-control\" id=\"exampleInputPassword1\" value.bind=\"credential.password\" placeholder=\"Password\"></div><button type=\"submit\" if.bind=\"! processing\" class=\"btn btn-primary btn-gradient btn-block waves-effect waves-light\" click.delegate=\"doLogin()\"><i class=\"batch-icon batch-icon-key mr-2\"></i> Login</button><div class=\"fa-2x text-center\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div><hr><p class=\"text-center\">Ainda não possui um usuário?<a href=\"/#/welcome\"> Registre-se aqui</a></p><p class=\"text-center\">Esqueceu sua senha?<a href=\"/#/forgotMyPassword\"> Clique aqui</a></p></form></div></div></div></div></template>"; });
define('text!views/welcome.html', ['module'], function(module) { module.exports = "<template><require from=\"./components/attributes/cnpjMask\"></require><require from=\"./components/attributes/cepMask\"></require><require from=\"./components/attributes/phoneWithDDDMask\"></require><require from=\"./components/attributes/cellPhoneWithDDDMask\"></require><require from=\"./components/valueConverters/cnpjValueConverter\"></require><require from=\"./components/valueConverters/cepValueConverter\"></require><require from=\"./components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"./components/valueConverters/cellPhoneWithDDDValueConverter\"></require><div class=\"row\"><div class=\"right-column sisu\"><div class=\"row mx-0\"><div class=\"col-md-7 order-md-2 signin-right-column px-5 bg-dark\"><a class=\"signin-logo d-sm-block d-md-none\" href=\"#\"><img src=\"assets/img/logo-white.png\" width=\"145\" height=\"32.3\" alt=\"QuillPro\"></a><h1 class=\"display-4\">CSZ Compras Inteligentes</h1><p class=\"lead mb-5\">Olá, seja bem-vindo</p></div><div class=\"col-md-5 order-md-1 signin-left-column bg-white px-5\"><div if.bind=\"wasCreated\"><h2>Obrigado!</h2><p class=\"mt-4\">Em breve nossa equipre entrará em contato com você para liberar acesso a ferramenta!</p></div><form if.bind=\"! wasCreated\"><h4 class=\"text-center\">Dados de Cadastro</h4><p>Preencha os dados abaixo para sabermos mais sobre você</p><div class=\"form-group\"><label class=\"control-label active\">Nome<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" value.bind=\"user.contactName  & validate\"></div><div class=\"form-group\"><label class=\"control-label active\">E-mail<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"email\" class=\"form-control\" value.bind=\"user.email  & validate\"></div><div class=\"form-group\"><label class=\"control-label active\">Telefone</label> <input type=\"text\" class=\"form-control\" phone-with-ddd value.bind=\"user.commercialPhone | phoneWithDDD  & validate\" id=\"exampleInputEmail1\" value.bind=\"credential.email\"></div><div class=\"form-group\"><label class=\"control-label active\">Telefone Celular</label> <input type=\"text\" class=\"form-control\" cell-phone-with-ddd value.bind=\"user.mobilePhone | cellPhoneWithDDD  & validate\" id=\"exampleInputEmail1\" value.bind=\"credential.email\"></div><div class=\"form-group\"><label class=\"control-label active\">Razão Social<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" value.bind=\"user.companyName  & validate\"></div><div class=\"form-group text-center mt-4\"><div class=\"form-check form-check-inline mt-3\"><input class=\"form-check-input\" type=\"radio\" name=\"inlineRadioOptions\" value=\"0\" checked.bind=\"user.selectedType\"> <label class=\"form-check-label\" for=\"inlineRadio1\">Fornecedor</label></div><div class=\"form-check form-check-inline ml-5 mt-3\"><input class=\"form-check-input\" type=\"radio\" name=\"inlineRadioOptions\" value=\"1\" checked.bind=\"user.selectedType\"> <label class=\"form-check-label\" for=\"inlineRadio2\">Food service</label></div></div><button type=\"submit\" if.bind=\"! isLoading\" class=\"btn btn-primary btn-gradient btn-block waves-effect waves-light mt-4\" click.delegate=\"save()\" if.bind=\"! isloading\"><i class=\"batch-icon batch-icon-mail\"></i> Salvar</button><div class=\"fa-2x text-center\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></form></div></div></div></div></template>"; });
define('text!views/forgotMyPassword.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"right-column sisu\"><div class=\"row mx-0\"><div class=\"col-md-7 order-md-2 signin-right-column px-5 bg-dark\"><a class=\"signin-logo d-sm-block d-md-none\" href=\"#\"><img src=\"assets/img/logo-white.png\" width=\"145\" height=\"32.3\" alt=\"QuillPro\"></a><h1 class=\"display-4\">CSZ Compras Inteligentes</h1><p class=\"lead mb-5\">Olá, seja bem-vindo</p></div><div class=\"col-md-5 order-md-1 signin-left-column bg-white px-5\"><a class=\"signin-logo d-sm-none d-md-block\" style=\"margin-left:10%\"><img class=\"ml-5\" src=\"assets/img/logo2T.png\" style=\"cursor:default\" width=\"150\" height=\"92\" alt=\"CSZ\"></a><div if.bind=\"wasReseted\"><h2>Obrigado!</h2><p class=\"mt-4\">Em breve você receberá um e-mail para redefinir a sua senha</p></div><form if.bind=\"! wasReseted\"><div class=\"form-group\"><label>E-mail</label> <input type=\"text\" class=\"form-control\" value.bind=\"email\" placeholder=\"E-mail\"></div><button type=\"submit\" if.bind=\"! isLoading\" class=\"btn btn-primary btn-gradient btn-block waves-effect waves-light\" click.delegate=\"resetPassword()\"><i class=\"batch-icon batch-icon-key mr-2\"></i> Confirmar</button><div class=\"fa-2x text-center\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></form></div></div></div></div></template>"; });
define('text!views/confirmInvite.html', ['module'], function(module) { module.exports = "<template><div class=\"row\" if.bind=\"! isLoading\"><div class=\"right-column sisu\"><div class=\"row mx-0\"><div class=\"col-md-7 order-md-2 signin-right-column px-5 bg-dark\"><a class=\"signin-logo d-sm-block d-md-none\" href=\"#\"><img src=\"assets/img/logo-white.png\" width=\"145\" height=\"32.3\" alt=\"QuillPro\"></a><h1 class=\"display-4\">CSZ Compras Inteligentes</h1><p class=\"lead mb-5\">Olá, seja bem-vindo ${user.name} </p></div><div class=\"col-md-5 order-md-1 signin-left-column bg-white px-5\"><a class=\"signin-logo d-sm-none d-md-block\" style=\"margin-left:10%\"><img class=\"ml-5\" src=\"assets/img/logo2T.png\" style=\"cursor:default\" width=\"150\" height=\"92\" alt=\"CSZ\"></a><form><div class=\"form-group\"><label for=\"exampleInputPassword1\">Senha</label> <input type=\"password\" class=\"form-control\" id=\"exampleInputPassword1\" value.bind=\"invite.password\" placeholder=\"Password\"></div><div class=\"form-group\"><label for=\"exampleInputPassword1\">Confirme sua senha</label> <input type=\"password\" class=\"form-control\" id=\"exampleInputPassword1\" value.bind=\"invite.confirmPassword\" placeholder=\"Password\"></div><button type=\"submit\" if.bind=\"! processing\" class=\"btn btn-primary btn-gradient btn-block waves-effect waves-light\" click.delegate=\"save()\"><i class=\"batch-icon batch-icon-key mr-2\"></i> Definir senha</button> <span if.bind=\"processing\" class=\"badge badge-warning\">Efetuando autenticação</span></form></div></div></div></div><div class=\"fa-5x ${  isLoading  ? '' : 'invisible'}\" style=\"position:fixed;top:40%;left:50%\"><i class=\"fa fa-refresh fa-spin\"></i></div></template>"; });
define('text!views/foodService/cadastro.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/cnpjMask\"></require><require from=\"../components/attributes/cepMask\"></require><require from=\"../components/attributes/phoneWithDDDMask\"></require><require from=\"../components/attributes/cellPhoneWithDDDMask\"></require><require from=\"../components/attributes/inscricaoEstadualMask\"></require><require from=\"../components/valueConverters/cnpjValueConverter\"></require><require from=\"../components/valueConverters/cepValueConverter\"></require><require from=\"../components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"../components/valueConverters/cellPhoneWithDDDValueConverter\"></require><require from=\"../components/valueConverters/inscricaoEstadualValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Cadastro de Cliente<div class=\"progress\"><div class=\"progress-bar progress-bar-sm bg-gradient\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:0%\"></div></div></div><div class=\"card-form-wizard\"><div class=\"row\"><div class=\"col-lg-12\"><div id=\"rootwizard-1\"><ul class=\"nav nav-pills\"><li><a href=\"#tab1\" data-toggle=\"tab\"><span class=\"main-text\"><span class=\"h3\">1. Dados Básicos</span></span></a></li><li><a href=\"#tab2\" data-toggle=\"tab\"><span class=\"main-text\"><span class=\"h3\">2. Endereço</span> <small>No validation required</small></span></a></li><li><a href=\"#tab3\" data-toggle=\"tab\"><span class=\"main-text\"><span class=\"h3\">3. Contatos</span></span></a></li></ul><div class=\"tab-content clearfix\"><div class=\"tab-pane\" id=\"tab1\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Razão Social *</label> <input type=\"text\" class=\"form-control disabled\" disabled=\"disabled\" value.bind=\"foodService.name\"></div><div class=\"form-group\"><label class=\"control-label\">CNPJ *</label> <input type=\"text\" class=\"form-control disabled\" disabled=\"disabled\" cnpj value.bind=\"foodService.cnpj | cnpj  \"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome Fantasia *</label> <input type=\"text\" class=\"form-control disabled\" disabled=\"disabled\" value.bind=\"foodService.fantasyName\"></div><div class=\"form-group\"><label class=\"control-label\">Inscrição Estadual *</label> <input type=\"text\" class=\"form-control disabled\" disabled=\"disabled\" inscricaoestadual value.bind=\"foodService.inscricaoEstadual | inscricaoEstadual\"></div></div></div></div><div class=\"tab-pane\" id=\"tab2\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">CEP</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isCepInvalid  ? 'border-danger' : '' } \" cep value.bind=\"foodService.address.cep | cep\" change.delegate=\"consultaCEP()\"></div></div></div><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Logradouro</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isLogradouroInvalid  ? 'border-danger' : '' } \" value.bind=\"foodService.address.logradouro\" change.delegate=\"validator.addressValidator.validateLogradouro()\"></div><div class=\"form-group\"><label class=\"control-label\">Bairro</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isNeighborhoodInvalid  ? 'border-danger' : '' } \" value.bind=\"foodService.address.neighborhood\" change.delegate=\"validator.addressValidator.validateNeighborhood()\"></div><div class=\"form-group\"><label class=\"control-label\">Estado</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isStateInvalid  ? 'border-danger' : '' } \" value.bind=\"foodService.address.state\" change.delegate=\"validator.addressValidator.validateState()\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Número</label> <input type=\"number\" class=\"form-control ${validator.addressValidator.isNumberInvalid  ? 'border-danger' : '' }\" value.bind=\"foodService.address.number\" change.delegate=\"validator.addressValidator.validateNumber()\"></div><div class=\"form-group\"><label class=\"control-label\">Cidade</label> <input type=\"text\" class=\"form-control ${validator.addressValidator.isCityInvalid  ? 'border-danger' : '' }\" value.bind=\"foodService.address.city\" change.delegate=\"validator.addressValidator.validateCity()\"></div><div class=\"form-group\"><label class=\"control-label\">Complemento</label> <input type=\"text\" class=\"form-control\" value.bind=\"foodService.address.complement\"></div></div></div></div><div class=\"tab-pane\" id=\"tab3\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isNameInvalid  ? 'border-danger' : '' }\" value.bind=\"foodService.contact.name\" change.delegate=\"validator.contactValidator.validateName()\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Comercial</label> <input type=\"text\" class=\"form-control\" phone-with-ddd value.bind=\"foodService.contact.commercialPhone | phoneWithDDD\" placeholder=\"(01) 1234-5678\"></div><div class=\"form-group\"><label class=\"control-label\">E-mail</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isEmailInvalid  ? 'border-danger' : '' } \" value.bind=\"foodService.contact.email\" change.delegate=\"validator.contactValidator.validateEmail()\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Telefone</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isPhoneInvalid  ? 'border-danger' : '' } \" phone-with-ddd value.bind=\"foodService.contact.phone | phoneWithDDD\" change.delegate=\"validator.contactValidator.validatePhone()\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Celular</label> <input type=\"text\" class=\"form-control\" cell-phone-with-ddd value.bind=\"foodService.contact.personalPhone | cellPhoneWithDDD\" placeholder=\"(01) 01234-5678\"></div></div></div></div><ul class=\"pager wizard\"><li class=\"previous\"><a href=\"#\" class=\"waves-effect waves-light\" click.trigger=\"back()\">Voltar</a></li><li class=\"next\" if.bind=\"currentStep < totalSteps\"><a href=\"#\" class=\"waves-effect waves-light\" click.trigger=\"advance()\">Avançar</a></li><li class=\"finish float-right\" if.bind=\"currentStep == totalSteps\"><button type=\"button\" if.bind=\"! isLoading\" class=\"btn btn-primary btn-gradient assign-task waves-effect waves-light\" click.trigger=\"save()\"><span class=\"gradient\">Salvar</span></button><div class=\"fa-2x text-center\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></li></ul></div></div></div></div></div></div></div></div></template>"; });
define('text!views/foodService/fornecedores.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/cnpjMask\"></require><require from=\"../components/attributes/phoneWithDDDMask\"></require><require from=\"../admin/supplier/editSupplier\"></require><div class=\"row mb-5 task-manager au-animate\" if.bind=\"! showDetails\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\"> ${title} </div><div class=\"card-body\"><div class=\"form-row align-items-center\"><div class=\"col-lg-3\"><label for=\"input-task-title\" class=\"active\">Filtro</label> <select class=\"form-control\" value.bind=\"tipoFiltro\" change.delegate=\"alterView()\"><option value=\"1\">Sugeridos</option><option value=\"2\">Meus fornecedores</option><option value=\"4\">Bloqueados</option><option value=\"3\">Todos</option></select></div><div class=\"col-lg-3\"><label for=\"input-task-title\" class=\"active\">Nome do fornecedor <span class=\"required-item\">*</span></label> <input type=\"text\" class=\"form-control input-task-title\" id=\"input-task-title\" placeholder=\"nome...\" change.trigger=\"search()\" value.bind=\"filter\"></div><div class=\"col-lg-3 ml-4 mt-3\" if.bind=\"! isLoading\"><button type=\"button\" class=\"btn btn-primary btn-gradient assign-task waves-effect waves-light\"><span class=\"gradient\">Pesquisar</span></button></div><div class=\"col-lg-3 ml-4 mt-3 fa-2x text-center\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div><div class=\"card-body\"><table class=\"table table-hover\"><thead><tr><th>Nome</th><th>Situação Cadastral</th><th>Contato</th><th>E-mail</th><th>Telefone</th><th>CNPJ</th><th></th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredSuppliers\"><td>${x.supplier.fantasyName}</td><td><span class=\"badge badge-primary\" if.bind=\"x.status == 0\">Não cadastrado</span> <span class=\"badge badge-warning\" if.bind=\"x.status == 1\">Cadastro enviado</span> <span class=\"badge badge-success\" if.bind=\"x.status == 2\">Disponível</span> <span class=\"badge badge-danger\" if.bind=\"x.status == 3\">Cadastro Rejeitado</span> <span class=\"badge badge-danger\" if.bind=\"x.status == 4\">Bloqueado</span> <span class=\"badge badge-warning\" if.bind=\"x.status == 5\">Aguardando aprovação</span> <span class=\"badge badge-danger\" if.bind=\"x.status == 6\">Bloqueado</span></td><td>${x.supplier.contact.name}</td><td>${x.supplier.contact.email}</td><td phone-with-ddd>${x.supplier.contact.phone}</td><td cnpj>${x.supplier.cnpj}</td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" if.bind=\"x.status == 0 && ! x.isLoading\" click.trigger=\"connect(x)\">Conectar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status == 2 && ! x.isLoading\" click.trigger=\"block(x)\">Bloquear</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" if.bind=\"x.status == 6 && ! x.isLoading\" click.trigger=\"unblock(x)\">Desbloquear</button></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"showSupplierDetails(x)\">Detalhes</button><div class=\"fa-2x text-center ${x.isLoading  == true ? '' : 'invisible'} mx-auto\"><i class=\"fa fa-refresh fa-spin\"></i></div></td></tr></tbody></table></div></div></div></div><div class=\" ${ showDetails ? '' : 'invisible' }\" class=\"au-animate\"><edit-supplier></edit-supplier></div></template>"; });
define('text!views/foodService/evaluations.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"../components/valueConverters/cellPhoneWithDDDValueConverter\"></require><require from=\"../components/valueConverters/cnpjValueConverter\"></require><require from=\"../components/valueConverters/cepValueConverter\"></require><require from=\"../components/valueConverters/dateFormatValueConverter\"></require><require from=\"../components/attributes/cnpjMask\"></require><require from=\"../components/attributes/cepMask\"></require><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Avaliações</div><div class=\"card-body\"><div if.bind=\"! evaluation\"><table class=\"table table-hover mt-2\"><thead><tr><th class=\"text-center\">Nº pedido</th><th class=\"text-right\">Valor do pedido</th><th class=\"text-center\">Food Service</th><th class=\"text-center\">Fornecedor</th><th class=\"text-center\">Data da avaliação</th><th class=\"text-center\" style=\"min-width:250px\">Avaliação</th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredEvaluations\"><td class=\"text-center\">${x.order.code}</td><td class=\"text-right\">${x.order.total | money}</td><td class=\"text-center\">${x.foodService.name}</td><td class=\"text-center\">${x.supplier.name}</td><td class=\"text-center\">${x.createdOn | dateFormat}</td><td class=\"text-center\"><i class=\"batch-icon ${ x.rating >= 1 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 2 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 3 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 4 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 5 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light mx-auto ml-2\" click.trigger=\"showDetails(x)\" if.bind=\"! x.processing\">Detalhes</button></td></tr></tbody></table></div><div if.bind=\"evaluation\"><div class=\"row mt-3\"><div class=\"col-md-12\"><h6 class=\"mt-5 mb-5\"><i class=\"batch-icon batch-icon-users mr-2\"></i>Dados do Food Service</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome</label> <label class=\"control-label col-md-6\">${evaluation.foodService.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Comercial</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.commercialPhone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">E-mail</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.email}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.phone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Celular</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.personalPhone | phoneWithDDD}</label></div></div></div></div><div class=\"col-md-12\"><h6 class=\"mt-5 mb-5\"><i class=\"batch-icon batch-icon-users mr-2\"></i>Dados do Fornecedor</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome</label> <label class=\"control-label col-md-6\">${evaluation.supplier.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Comercial</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.commercialPhone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">E-mail</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.email}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.phone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Celular</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.personalPhone | phoneWithDDD}</label></div></div></div></div><div class=\"col-md-12 mt-5\"><div class=\"form-group mx-auto text-center\"><h5 class=\"text-center\">Nota da avaliação</h5><i class=\"batch-icon ${ evaluation.rating  >= 1 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl mt-2\"></i> <i class=\"batch-icon ${ evaluation.rating >= 2 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl\"></i> <i class=\"batch-icon ${ evaluation.rating >= 3 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl\"></i> <i class=\"batch-icon ${ evaluation.rating >= 4 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl\"></i> <i class=\"batch-icon ${ evaluation.rating >= 5 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl mb-2\"></i></div></div><div class=\"col-md-12 mt-3\"><div class=\"form-group mx-auto\"><label class=\"control-label\">Comentários</label> <textarea class=\"form-control disabled\" disabled=\"disabled\" value.bind=\"evaluation.comment\" rows=\"2\"></textarea></div></div></div><div class=\"text-center\"><button type=\"button\" class=\"btn btn-secondary waves-effect waves-light ml-2\" click.trigger=\"evaluation = null\" if.bind=\"! evaluation.processing\"><i class=\"fa fa-undo mr-2\"></i>Voltar</button></div></div></div></div></div></div></template>"; });
define('text!views/foodService/meusProdutos.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/attributes/numberMask\"></require><require from=\"../components/attributes/timeMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/valueConverters/numberValueConverter\"></require><require from=\"../components/valueConverters/timeValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Produtos</div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12 pb-5\"><ul class=\"nav nav-tabs\" id=\"myTab-1\" role=\"tablist\"><li class=\"nav-item waves-effect waves-light\"><a class=\"nav-link active\" href=\"#tab-1-1\" data-toggle=\"tab\" role=\"tab\" aria-controls=\"tab-1-1\" aria-selected=\"true\" aria-expanded=\"true\"><i class=\"batch-icon batch-icon-list-alt mr-2\"></i> Seleção de Produtos</a></li><li class=\"nav-item waves-effect waves-light\"><a class=\"nav-link\" href=\"#tab-1-2\" data-toggle=\"tab\" role=\"tab\" aria-controls=\"tab-1-2\" aria-selected=\"false\" aria-expanded=\"false\"><i class=\"batch-icon batch-icon-paragraph-alt-justify mr-2\"></i> Meus Produtos <span class=\"badge badge-warning\" if.bind=\"productAddedCount > 0\">${ productAddedCount }</span></a></li></ul><div class=\"tab-content\" id=\"myTabContent-1\"><div class=\"tab-pane fade active show\" id=\"tab-1-1\" role=\"tabpanel\" aria-labelledby=\"tab-1-1\" aria-expanded=\"true\"><p class=\"p-3\"><require from=\"../components/partials/selecaoDeProdutosFoodService\"></require><selecao-de-produtos-food-service containerless></selecao-de-produtos-food-service></p></div><div class=\"tab-pane fade\" id=\"tab-1-2\" role=\"tabpanel\" aria-labelledby=\"tab-1-2\" aria-expanded=\"false\"><p class=\"p-3\"><require from=\"../components/partials/produtosSelecionados\"></require><produtos-selecionados containerless></produtos-selecionados></p></div></div></div></div></div></div></div></div></template>"; });
define('text!views/foodService/regraDeEntrega.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/attributes/numberMask\"></require><require from=\"../components/attributes/timeMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/valueConverters/numberValueConverter\"></require><require from=\"../components/valueConverters/timeValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Regras de Entrega</div><div class=\"card-body\"><div class=\"row mt-5\"><div class=\"col-md-4\"><div class=\"form-group\"><h4>Tipo de mercado</h4></div></div></div><div class=\"row mt-2\"><div class=\"col-md-4\"><select class=\"form-control\" change.delegate=\"loadRule()\" value.bind=\"selectedClass\"><option value=\"\"></option><option repeat.for=\"x of productClasses\" model.bind=\"x\">${x.name}</option></select></div></div><div class=\"row mt-5\" if.bind=\"rule != null\"><div class=\"col-md-4\"><div class=\"form-group\"><h4>Dias de entrega</h4></div></div><div class=\"col-md-12 mt-2\"><div class=\"form-check form-check-inline\"><label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"0\" checked.bind=\"rule.deliveryOnMonday\"> <span class=\"badge ${ rule.deliveryOnMonday ? 'badge-success' : 'badge-warning' }\">Segunda-feira</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"1\" checked.bind=\"rule.deliveryOnTuesday\"> <span class=\"badge ${ rule.deliveryOnTuesday ? 'badge-success' : 'badge-warning' }\">Terça-feira</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"2\" checked.bind=\"rule.deliveryOnWednesday\"> <span class=\"badge ${ rule.deliveryOnWednesday ? 'badge-success' : 'badge-warning' }\">Quarta-feira</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"3\" checked.bind=\"rule.deliveryOnThursday\"> <span class=\"badge ${ rule.deliveryOnThursday ? 'badge-success' : 'badge-warning' }\">Quinta-feira</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"4\" checked.bind=\"rule.deliveryOnFriday\"> <span class=\"badge ${ rule.deliveryOnFriday ? 'badge-success' : 'badge-warning' }\">Sexta-feira</span></label></div><div class=\"form-check form-check-inline\"><label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"5\" checked.bind=\"rule.deliveryOnSaturday\"> <span class=\"badge ${ rule.deliveryOnSaturday ? 'badge-success' : 'badge-warning' }\">Sábado</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"6\" checked.bind=\"rule.deliveryOnSunday\"> <span class=\"badge ${ rule.deliveryOnSunday ? 'badge-success' : 'badge-warning' }\">Domingo</span></label></div></div></div><div class=\"row mt-5\" if.bind=\"rule != null\"><div class=\"col-md-4\"><div class=\"form-group\"><h4>Período de entrega</h4></div><div class=\"col-md-12 mt-5\"><div class=\"input-group\"><span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control\" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"rule.deliveryScheduleInitial | time & updateTrigger:'blur' \"> <label class=\"mr-sm-2 ml-2\" for=\"inlineFormCustomSelect\">as</label> <span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control\" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"rule.deliveryScheduleFinal | time & updateTrigger:'blur' \"></div></div></div></div><div class=\"row mt-5\" if.bind=\"rule != null\"><button type=\"button\" class=\"btn btn-primary btn-gradient assign-task waves-effect waves-light mx-auto\" click.trigger=\"save()\" if.bind=\"! isLoading\"><span class=\"gradient\">Salvar</span></button><div class=\"fa-2x text-center mx-auto\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></div></template>"; });
define('text!views/foodService/dashboard.html', ['module'], function(module) { module.exports = "<template><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-body\"><div class=\"col-md-7 order-md-2 signin-right-column px-5\"><a class=\"signin-logo d-sm-none d-md-block\"><img class=\"ml-5\" src=\"assets/img/logo2T.png\" style=\"cursor:default\" width=\"150\" height=\"92\" alt=\"CSZ\"></a><h1 class=\"display-6\">CSZ Compras Inteligentes</h1><p class=\"lead mb-5\">Olá, seja bem-vindo</p><p></p></div></div></div></div></div></template>"; });
define('text!views/foodService/pedidosFoodService.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/attributes/timeMask\"></require><require from=\"../components/valueConverters/timeValueConverter\"></require><require from=\"../components/valueConverters/dateFormatValueConverter\"></require><require from=\"../components/attributes/cnpjMask\"></require><require from=\"../components/attributes/cepMask\"></require><require from=\"../components/attributes/phoneWithDDDMask\"></require><require from=\"../components/attributes/cellPhoneWithDDDMask\"></require><require from=\"../components/valueConverters/cnpjValueConverter\"></require><require from=\"../components/valueConverters/cepValueConverter\"></require><require from=\"../components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"../components/valueConverters/cellPhoneWithDDDValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\"><span if.bind=\"! showdDetails\">Meus Pedidos </span><span if.bind=\"showdDetails\">Pedido nº ${selectedOrder.code}</span></div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12\" if.bind=\"showdDetails\"><div class=\"mt-1\"><h5 class=\"mb-0\"> ${selectedOrder.supplier.name} <span class=\"badge badge-danger float-right\" if.bind=\"selectedOrder.status == 0\">Aguardando aprovação</span> <span class=\"badge badge-warning float-right\" if.bind=\"selectedOrder.status == 1\">Aprovado</span> <span class=\"badge badge-primary float-right\" if.bind=\"selectedOrder.status == 2\">Entregue</span> <span class=\"badge badge-default float-right\" if.bind=\"selectedOrder.status == 3\">Rejeitado</span><br><span class=\"badge badge-warning float-right\" if.bind=\"selectedOrder.deliveryDate != null\">Data da Entrega: ${selectedOrder.deliveryDate | dateFormat}</span><br><span class=\"badge badge-warning float-right\" if.bind=\"selectedOrder.deliveryScheduleStart != null\">Horário de Entrega: das ${selectedOrder.deliveryScheduleStart | time} as ${selectedOrder.deliveryScheduleEnd | time} </span><br><span class=\"badge badge-danger float-left\" if.bind=\"selectedOrder.reasonToReject && selectedOrder.reasonToReject != '' \">Motivo da Rejeição: ${selectedOrder.reasonToReject}</span></h5><div><div class=\"card-header ml-0\" role=\"tab\" id=\"headingTwo\"><h4>Dados do Fornecedor</h4></div><div><div class=\"card-body\"><h6 class=\"mt-2 mb-5\"><i class=\"fa fa-tag mr-2\"></i>Cadastro</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Razão Social</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">CNPJ</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.cnpj | cnpj}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome Fantasia</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.fantasyName}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Inscrição Estadual</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.stateRegistration.name}</label></div></div></div><h6 class=\"mt-5 mb-5\"><i class=\"fa fa-envelope-o mr-2\"></i> Endereço</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">CEP</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.address.cep | cep}</label></div></div></div><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Logradouro</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.address.logradouro}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Bairro</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.address.neighborhood}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Estado</label> <label class=\"control-label col-md-6\">${selectedOrder.address.state}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Número</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.address.number}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Cidade</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.address.city}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Complemento</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.address.complement}</label></div></div></div><h6 class=\"mt-5 mb-5\"><i class=\"batch-icon batch-icon-users mr-2\"></i>Contato</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.contact.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Comercial</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.contact.commercialPhone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">E-mail</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.contact.email}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.contact.phone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Celular</label> <label class=\"control-label col-md-6\">${selectedOrder.supplier.contact.personalPhone | phoneWithDDD}</label></div></div></div></div></div><div class=\"card-header ml-0\" role=\"tab\" id=\"headingTwo\"><h4>Dados do pedido</h4></div><div><table class=\"table table-hover table-responsive\"><thead><tr><th class=\"text-center\">Nome do Produto</th><th>Descrição</th><th>Categoria</th><th>UM</th><th>Marca</th><th class=\"text-center\">Quantidade</th><th class=\"text-center\">Preço unitário</th><th class=\"text-center\">Total</th></tr></thead><tbody><tr repeat.for=\"item of selectedOrder.items\"><td>${item.product.name}</td><td class=\"text-center align-middle\">${item.product.description}</td><td>${item.product.category.name}</td><td>${item.product.unit.name}</td><td>${item.product.brand.name}</td><td class=\"text-center\">${item.quantity | money}</td><td class=\"text-center\">${item.price | money}</td><td class=\"text-center\">${item.total | money}</td></tr></tbody></table></div></div></div><div class=\"text-center mt-3\"><button type=\"button\" class=\"btn btn-secondary waves-effect waves-light\" click.trigger=\"showdDetails = false\"><i class=\"fa fa-undo mr-2\" aria-hidden=\"true\"></i>Voltar</button> <button type=\"button\" class=\"btn btn-success waves-effect waves-light\" click.trigger=\"exportOrder(selectedOrder)\"><i class=\"fa fa-file-excel-o mr-2\"></i> Exportar</button></div></div><div class=\"col-md-12\" if.bind=\"! showdDetails\"><div class=\"form-row align-items-center\"><div class=\"col-lg-3\"><label for=\"input-task-title\" class=\"active\">Dados do pedido</label> <input type=\"text\" class=\"form-control input-task-title\" id=\"input-task-title\" placeholder=\"Codigo / Cliente / Contato / Valor\" change.trigger=\"search()\" value.bind=\"filter\"></div><div class=\"col-lg-3 ml-5\"><label for=\"input-task-title\" class=\"active\">Status</label> <select class=\"form-control\" value.bind=\"selectedStatus\" change.delegate=\"load()\"><option value=\"0\" selected=\"selected\">Novo pedido</option><option value=\"1\">Aceito</option><option value=\"2\">Entregue</option><option value=\"3\">Rejeitado</option></select></div><div class=\"col-lg-3 ml-4 mt-3\"><button type=\"button\" class=\"btn btn-primary btn-gradient assign-task waves-effect waves-light\"><span class=\"gradient\">Pesquisar</span></button></div></div><div><table class=\"table table-hover table-responsive mt-5\"><thead><tr><th class=\"text-center\">Código</th><th class=\"text-center\">Status</th><th>Data do Pedido</th><th class=\"text-center\">Criado por</th><th class=\"text-center\">Data de entrega</th><th class=\"text-center\">Horário de entrega</th><th class=\"text-center\">Data de pgto</th><th class=\"text-center\">Fornecedor</th><th class=\"text-center\">Total</th><th></th></tr></thead><tbody><tr repeat.for=\"order of filteredOrders\"><td class=\"text-center\">${order.code}</td><td class=\"text-center\"><span class=\"badge badge-success\" if.bind=\"order.status == 0\">Novo pedido</span> <span class=\"badge badge-warning\" if.bind=\"order.status == 1\">Aceito</span> <span class=\"badge badge-primary\" if.bind=\"order.status == 2\">Entregue</span> <span class=\"badge badge-default\" if.bind=\"order.status == 3\">Rejeitado</span></td><td>${order.createdOn | dateFormat}</td><td class=\"text-center\">${order.createdBy.name} <span class=\"ml-2\">(${order.createdBy.email})</span></td><td class=\"text-center\">${order.deliveryDate | dateFormat}</td><td class=\"text-center\"><span if.bind=\"order.deliveryScheduleStart != null && order.deliveryScheduleEnd != null\">das ${order.deliveryScheduleStart | time} as ${order.deliveryScheduleEnd | time} </span></td><td>${order.paymentDate | dateFormat}</td><td class=\"text-center\">${order.supplier.name}</td><td class=\"text-right\">${order.total | money}</td><td class=\"text-right\"><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"selectOrder(order)\">Ver detalhes</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" click.trigger=\"exportOrder(order)\"><i class=\"fa fa-file-excel-o mr-2\"></i> Exportar</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" click.trigger=\"deliverOrder(order)\" if.bind=\"order.status == 1\">Efetuar baixa <i class=\"fa fa-arrow-right ml-2\" aria-hidden=\"true\"></i></button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" click.trigger=\"quoteAgain(order)\" if.bind=\"order.status == 3\">Cotar novamente <i class=\"fa fa-arrow-right ml-2\" aria-hidden=\"true\"></i></button></td></tr></tbody></table></div></div></div></div></div></div></div></template>"; });
define('text!views/cotacao/pedidosFornecedor.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/attributes/timeMask\"></require><require from=\"../components/valueConverters/timeValueConverter\"></require><require from=\"../components/valueConverters/dateFormatValueConverter\"></require><require from=\"../components/attributes/cnpjMask\"></require><require from=\"../components/attributes/cepMask\"></require><require from=\"../components/attributes/phoneWithDDDMask\"></require><require from=\"../components/attributes/cellPhoneWithDDDMask\"></require><require from=\"../components/valueConverters/cnpjValueConverter\"></require><require from=\"../components/valueConverters/cepValueConverter\"></require><require from=\"../components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"../components/valueConverters/cellPhoneWithDDDValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\"><span if.bind=\"! showdDetails\">Meus Pedidos </span><span if.bind=\"showdDetails\">Pedido nº ${selectedOrder.code}</span></div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12\" if.bind=\"showdDetails\"><div class=\"mt-1\"><h5 class=\"mb-0\"> ${selectedOrder.foodService.name} <span class=\"badge badge-danger float-right\" if.bind=\"selectedOrder.status == 0\">Aguardando aprovação</span> <span class=\"badge badge-warning float-right\" if.bind=\"selectedOrder.status == 1\">Aprovado</span> <span class=\"badge badge-primary float-right\" if.bind=\"selectedOrder.status == 2\">Entregue</span><br><span class=\"badge badge-warning float-right\" if.bind=\"selectedOrder.deliveryDate != null\">Data da Entrega: ${selectedOrder.deliveryDate | dateFormat}</span><br><span class=\"badge badge-warning float-right\" if.bind=\"selectedOrder.deliveryScheduleStart != null\">Horário de Entrega: das ${selectedOrder.deliveryScheduleStart | time} as ${selectedOrder.deliveryScheduleEnd | time} </span><br><span class=\"badge badge-danger float-left\" if.bind=\"selectedOrder.reasonToReject && selectedOrder.reasonToReject != '' \">Motivo da Rejeição: ${selectedOrder.reasonToReject}</span></h5><div><div class=\"card-body\"><h6 class=\"mt-2 mb-5\"><i class=\"fa fa-tag mr-2\"></i>Cadastro</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Razão Social</label> <label class=\"control-label col-md-6\">${foodService.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">CNPJ</label> <label class=\"control-label col-md-6\">${foodService.cnpj | cnpj}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome Fantasia</label> <label class=\"control-label col-md-6\">${foodService.fantasyName}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Inscrição Estadual</label> <label class=\"control-label col-md-6\">${foodService.stateRegistration.name}</label></div></div></div><h6 class=\"mt-5 mb-5\"><i class=\"fa fa-envelope-o mr-2\"></i> Endereço</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">CEP</label> <label class=\"control-label col-md-6\">${foodService.address.cep | cep}</label></div></div></div><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Logradouro</label> <label class=\"control-label col-md-6\">${foodService.address.logradouro}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Bairro</label> <label class=\"control-label col-md-6\">${foodService.address.neighborhood}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Estado</label> <label class=\"control-label col-md-6\">${foodService.address.state}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Número</label> <label class=\"control-label col-md-6\">${foodService.address.number}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Cidade</label> <label class=\"control-label col-md-6\">${foodService.address.city}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Complemento</label> <label class=\"control-label col-md-6\">${foodService.address.complement}</label></div></div></div><h6 class=\"mt-5 mb-5\"><i class=\"batch-icon batch-icon-users mr-2\"></i>Contato</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome</label> <label class=\"control-label col-md-6\">${foodService.contact.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Comercial</label> <label class=\"control-label col-md-6\">${foodService.contact.commercialPhone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">E-mail</label> <label class=\"control-label col-md-6\">${foodService.contact.email}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone</label> <label class=\"control-label col-md-6\">${foodService.contact.phone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Celular</label> <label class=\"control-label col-md-6\">${foodService.contact.personalPhone | phoneWithDDD}</label></div></div></div></div></div><div class=\"card-header ml-0\" role=\"tab\" id=\"headingTwo\"><h4>Dados do pedido</h4></div><div><table class=\"table table-hover table-responsive\"><thead><tr><th class=\"text-left\">Nome do Produto</th><th>Descrição</th><th>Categoria</th><th>UM</th><th>Marca</th><th class=\"text-center\">Quantidade</th><th class=\"text-center\">Preço unitário</th><th class=\"text-center\">Total</th></tr></thead><tbody><tr repeat.for=\"item of selectedOrder.items\"><td>${item.product.name}</td><td>${item.product.description}</td><td>${item.product.category.name}</td><td>${item.product.unit.name}</td><td>${item.product.brand.name}</td><td class=\"text-center\">${item.quantity | money}</td><td class=\"text-center\">${item.price | money}</td><td class=\"text-center\">${item.total | money}</td></tr></tbody></table></div></div><div class=\"text-center mt-3\"><button type=\"button\" class=\"btn btn-secondary waves-effect waves-light\" click.trigger=\"showdDetails = false\"><i class=\"fa fa-undo mr-2\" aria-hidden=\"true\"></i>Voltar</button> <button type=\"button\" class=\"btn btn-success waves-effect waves-light\" click.trigger=\"exportOrder(selectedOrder)\"><i class=\"fa fa-file-excel-o mr-2\"></i> Exportar</button> <button type=\"button\" class=\"btn btn-success waves-effect waves-light\" click.trigger=\"acceptOrder(selectedOrder)\" if.bind=\"selectedOrder.status == 0\">Aceitar <i class=\"fa fa-arrow-right ml-2\" aria-hidden=\"true\"></i></button></div></div><div class=\"col-md-12\" if.bind=\"! showdDetails\"><div class=\"form-row align-items-center\"><div class=\"col-lg-4 ml-1\"><label for=\"input-task-title\" class=\"active\">Status</label> <select class=\"form-control\" value.bind=\"selectedStatus\" change.delegate=\"load()\"><option value=\"0\" selected=\"selected\">Novo pedido</option><option value=\"1\">Aceito</option><option value=\"2\">Entregue</option><option value=\"3\">Rejeitado</option></select></div><div class=\"col-lg-4\"><label for=\"input-task-title\" class=\"active\">Dados do pedido</label> <input type=\"text\" class=\"form-control input-task-title\" placeholder=\"Codigo / Cliente / Contato / Valor\" change.trigger=\"search()\" value.bind=\"filter\"></div><div class=\"col-lg-3 ml-4 mt-3\"><button type=\"button\" click.trigger=\"search()\" class=\"btn btn-primary btn-gradient assign-task waves-effect waves-light\"><span class=\"gradient\">Pesquisar</span></button></div></div><div><table class=\"table table-hover table-responsive\"><thead><tr><th class=\"text-center\">Código</th><th class=\"text-center\">Status</th><th>Data do Pedido</th><th class=\"text-center\">Data de entrega</th><th class=\"text-center\">Horário de entrega</th><th class=\"text-center\">Cliente</th><th class=\"text-center\">Contato</th><th class=\"text-center\">Quantidade de Produtos</th><th class=\"text-center\">Total</th><th></th></tr></thead><tbody><tr repeat.for=\"order of filteredOrders\"><td class=\"text-center\">${order.code}</td><td class=\"text-center\"><span class=\"badge badge-danger\" if.bind=\"order.status == 0\">Novo pedido</span> <span class=\"badge badge-warning\" if.bind=\"order.status == 1\">Aceito</span> <span class=\"badge badge-primary\" if.bind=\"order.status == 2\">Entregue</span> <span class=\"badge badge-default\" if.bind=\"order.status == 3\">Rejeitado</span></td><td>${order.createdOn | dateFormat}</td><td class=\"text-center\">${order.deliveryDate | dateFormat}</td><td class=\"text-center\"><span if.bind=\"order.deliveryScheduleStart != null && order.deliveryScheduleEnd != null\">das ${order.deliveryScheduleStart | time} as ${order.deliveryScheduleEnd | time} </span></td><td class=\"text-center\">${order.foodService.name}</td><td class=\"text-center\">${order.createdBy.name}</td><td class=\"text-center\">${order.items.length}</td><td class=\"text-right\">${order.total | money}</td><td class=\"text-right\"><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"selectOrder(order)\">Ver detalhes</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" click.trigger=\"exportOrder(order)\"><i class=\"fa fa-file-excel-o mr-2\"></i> Exportar</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" click.trigger=\"acceptOrder(order)\" if.bind=\"order.status == 0\"><i class=\"fa fa-check mr-2\"></i>Aprovar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" click.trigger=\"rejectOrder(order)\" if.bind=\"order.status == 0\"><i class=\"fa fa-times mr-2\" aria-hidden=\"true\"></i> Rejeitar</button></td></tr></tbody></table></div></div></div></div></div></div></div></template>"; });
define('text!views/cotacao/cotacao.html', ['module'], function(module) { module.exports = "<template><require from=\"jquery-datetimepicker/jquery.datetimepicker.min.css\"></require><require from=\"../components/attributes/datepicker\"></require><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/valueConverters/dateFormatValueConverter\"></require><require from=\"../components/attributes/timeMask\"></require><require from=\"../components/valueConverters/timeValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Cotação<div class=\"progress\"><div class=\"progress-bar progress-bar-sm bg-gradient\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:0%\"></div></div></div><div class=\"card-form-wizard\"><div class=\"row\"><div class=\"col-lg-12\"><div id=\"rootwizard-1\"><ul class=\"nav nav-pills\"><li><a href=\"#tab1\" data-toggle=\"tab\"><span class=\"main-text\"><span class=\"h3\">1. Lista de Compras</span></span></a></li><li><a href=\"#tab2\" data-toggle=\"tab\"><span class=\"main-text\"><span class=\"h3\">2. Cotações</span></span></a></li><li><a href=\"#tab3\" data-toggle=\"tab\"><span class=\"main-text\"><span class=\"h3\">3. Pedido</span></span></a></li></ul><div class=\"tab-content clearfix\"><div class=\"tab-pane\" id=\"tab1\"><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-3\"><div class=\"form-group\"><label class=\"control-label\">Selecione a lista de compras</label> <select class=\"form-control\" value.bind=\"selectedQuote\" change.trigger=\"loadDeliveryRule()\"><option value=\"\"></option><option repeat.for=\"quote of quotes\" model.bind=\"quote\">${quote.buyListName}</option></select></div></div></div><div class=\"row mt-2\" if.bind=\"selectedQuote.products.length > 0\"><div class=\"col-md-3\"><div class=\"form-group\"><label class=\"control-label\">Informe a data de entrega</label> <input type=\"text\" class=\"form-control\" autocomplete=\"off\" placeholder=\"00/00/0000\" value.bind=\"viewModel.deliveryDate | dateFormat \" datepicker change.trigger=\"checkDeliveryDate()\"></div></div><div class=\"col-md-3\"><div class=\"form-group\"><label class=\"control-label\">Horário inicial</label><div class=\"input-group\"><span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control\" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"viewModel.deliveryScheduleStart | time \" change.trigger=\"checkDeliveryDate()\"></div></div></div><div class=\"col-md-3\"><div class=\"form-group\"><label class=\"control-label\">Horário final</label><div class=\"input-group\"><span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control\" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"viewModel.deliveryScheduleEnd | time \" change.trigger=\"checkDeliveryDate()\"></div></div></div></div><div class=\"row\"><div class=\"col-md-12 mt-5\"><span class=\"badge badge-warning\" if.bind=\"selectedQuote.products.length == 0\">Lista sem produtos selecionados. Favor incluir em Produtos > Meus Produtos</span><div if.bind=\"selectedQuote.products.length > 0 \"><div class=\"col-md-12 mt-3\"><div class=\"form-group\"><p>Você pode remover fornecedores da sua cotação</p><span style=\"padding:10px;cursor:pointer\" click.trigger=\"addRemoveSupplier(supplier)\" repeat.for=\"supplier of selectedQuote.suppliers\" class=\"badge ${ supplier.isInvalid ? 'badge-danger' : ! supplier.wasRemoved ?  'badge-success' : 'badge-default' } ml-3 mt-2\"><i class=\"fa fa-times mr-3\" if.bind=\"supplier.isInvalid\" aria-hidden=\"true\" style=\"cursor:pointer\" click.trigger=\"removeSupplier(supplier)\"></i> <i class=\"fa fa-times mr-3\" if.bind=\"! supplier.wasRemoved && ! supplier.isInvalid\" aria-hidden=\"true\" style=\"cursor:pointer\" click.trigger=\"removeSupplier(supplier)\"></i> <i class=\"fa fa-plus mr-3\" if.bind=\"supplier.wasRemoved && ! supplier.isInvalid\" aria-hidden=\"true\" style=\"cursor:pointer\" click.trigger=\"addSupplier(supplier)\"></i> ${supplier.name} </span><div class=\"row mt-3\"><div class=\"col-md-12\" repeat.for=\"x of checkDeliveryResult.items\"><span class=\"badge badge-danger\">${x.message}</span></div></div></div><table class=\"table table-hover table-responsive mt-2\"><thead><tr><th>Nome do produto</th><th>Descrição</th><th>Categoria</th><th>UM</th><th>Marca</th><th class=\"text-center\">Fornecedores</th><th class=\"text-center\">Quantidade</th></tr></thead><tbody><tr repeat.for=\"product of selectedQuote.products\"><td><span class=\"badge badge-warning\" if.bind=\"product.suppliers == null || product.suppliers.length == 0\"><i class=\"fa fa-warning\"></i> ${product.name} </span><span if.bind=\"product.suppliers != null && product.suppliers.length > 0\">${product.name}</span></td><td>${product.description}</td><td>${product.category}</td><td>${product.unitOfMeasure}</td><td>${product.brand}</td><td class=\"text-right\"><span style=\"padding:10px;cursor:pointer\" click.trigger=\"addRemoveSupplier(supplier)\" repeat.for=\"supplier of product.suppliers\" class=\"badge ${  supplier.isInvalid ? 'badge-danger' : ! supplier.wasRemoved ?  'badge-success' : 'badge-default' } ml-3 mt-2\"><i class=\"fa fa-times mr-3\" if.bind=\"! supplier.wasRemoved && ! suplier.isInvalid \" aria-hidden=\"true\" style=\"cursor:pointer\" click.trigger=\"removeSupplier(supplier)\"></i> <i class=\"fa fa-plus mr-3\" if.bind=\"supplier.wasRemoved && ! suplier.isInvalid  \" aria-hidden=\"true\" style=\"cursor:pointer\" click.trigger=\"addSupplier(supplier)\"></i> ${supplier.name} </span><span class=\"font-bold\" if.bind=\"product.suppliers == null || product.suppliers.length == 0\">Não há fornecedores cadastrados que oferecem esse produto</span></td><td class=\"text-center\"><div class=\"col-md-8 mx-auto\"><input type=\"text\" class=\"money text-right form-control ${ product.suppliers == null || product.suppliers.length == 0 ? 'disabled' : '' }\" autocomplete=\"off\" value.bind=\"product.quantity | money\" money placeholder=\"000\" disabled.bind=\"product.suppliers == null || product.suppliers.length == 0\"></div></td></tr></tbody></table></div></div></div></div></div></div><div class=\"tab-pane\" id=\"tab2\"><div class=\"row\" if.bind=\"isProcessing\"><div class=\"col-md-6\"><div class=\"form-group\"><span if.bind=\"processing\" class=\"badge badge-warning\">Efetuando cotação</span></div></div></div><div class=\"col-md-12\"><div id=\"accordion2\" role=\"tablist\" aria-multiselectable=\"true\"><div class=\"col-md-12 mt-3\" if.bind=\"buyList\"><div class=\"form-group\"><span class=\"badge badge-warning\">Selecione uma das cotações abaixo</span></div></div><div class=\"mt-4\" if.bind=\"! isProcessing\" repeat.for=\"result of simulation.betterResults\"><div class=\"card-header ml-0\" role=\"tab\" id=\"result${result.id}\"><h5 class=\"mb-0\"><label class=\"custom-control custom-checkbox text-center\"><input type=\"checkbox\" class=\"custom-control-input\" change.trigger=\"changeSelectedCotacao(result)\" checked.bind=\"result.isSelected\"> <span class=\"custom-control-indicator\"></span></label> <a data-toggle=\"collapse\" data-parent=\"#accordion2\" href=\"#collapse${result.id}\" aria-expanded=\"false\" aria-controls=\"collapse${result.id}\" class=\"\">Cotação ${$index + 1} <i class=\"fa fa-check\" if.bind=\"result.isSelected\"></i> <span class=\"text-right float-right\">${result.total  | money}</span></a></h5></div><div id=\"collapse${result.id}\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\" style=\"\"><div class=\"card-body\"><h4 class=\"mt-4\">Alertas</h4><p style=\"padding:10px;cursor:pointer\" repeat.for=\"item of result.logMessages.split(';')\" if.bind=\"item != null && item != ''\" class=\"badge badge-warning ml-3 mt-2\"><i class=\"fa fa-warning\"></i> ${item} </p><h4 class=\"mt-5\">Fornecedores</h4><div class=\"col-md-12 card-table table-responsive\"><table class=\"table table-hover table-sm align-middle\"><thead><tr><th class=\"text-left\">Fornecedor</th><th class=\"text-center\">Avaliação</th><th class=\"text-center\">Qtde de dias para aceite</th><th class=\"text-center\">Período de Aceite</th><th class=\"text-center\">Dias de entrega</th><th class=\"text-center\">Período de Entrega</th><th class=\"text-right\">Total</th></tr></thead><tbody><tr repeat.for=\"item of result.summaryItems\"><td> ${item.supplier.fantasyName} </td><td class=\"text-center\"><i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i></td><td class=\"text-center\"> ${item.rule.numberOfDaysToAccept} dias</td><td class=\"text-center\"> ${item.rule.periodToAcceptOrder1 | time} <label class=\"mr-sm-2 ml-2\" for=\"inlineFormCustomSelect\">as</label> ${item.rule.periodToAcceptOrder2 | time} </td><td class=\"text-center\"><span if.bind=\"item.rule.deliveryOnMonday\" class=\"badge ${ item.rule.deliveryOnMonday ? 'badge-success' : 'badge-warning' }\">Segunda-feira</span> <span if.bind=\"item.rule.deliveryOnTuesday\" class=\"badge ${ item.rule.deliveryOnTuesday ? 'badge-success' : 'badge-warning' }\">Terça-feira</span> <span if.bind=\"item.rule.deliveryOnWednesday\" class=\"badge ${ item.rule.deliveryOnWednesday ? 'badge-success' : 'badge-warning' }\">Quarta-feira</span> <span if.bind=\"item.rule.deliveryOnThursday\" class=\"badge ${ item.rule.deliveryOnThursday ? 'badge-success' : 'badge-warning' }\">Quinta-feira</span> <span if.bind=\"item.rule.deliveryOnFriday\" class=\"badge ${ item.rule.deliveryOnFriday ? 'badge-success' : 'badge-warning' }\">Sexta-feira</span><br><br><span if.bind=\"item.rule.deliveryOnSaturday\" class=\"badge ${ item.rule.deliveryOnSaturday ? 'badge-success' : 'badge-warning' }\">Sábado</span> <span if.bind=\"item.rule.deliveryOnSunday\" class=\"badge ${ item.rule.deliveryOnSunday ? 'badge-success' : 'badge-warning' }\">Domingo</span></td><td class=\"text-center\"> ${item.rule.deliverySchedule1 | time} <label class=\"mr-sm-2 ml-2\" for=\"inlineFormCustomSelect\">as</label> ${item.rule.deliverySchedule2 | time} </td><td class=\"text-right\"> ${item.total | money} </td></tr></tbody></table></div><h4 class=\"mt-5\">Produtos</h4><div class=\"col-md-12 card-table table-responsive\"><table class=\"table table-hover table-sm align-middle\"><thead><tr><th class=\"text-left\">Nome do Produto</th><th class=\"text-left\">Descrição</th><th class=\"text-center\">UM</th><th class=\"text-right\">Preço unitário</th><th class=\"text-right\">Quantidade</th><th class=\"text-right\">Total</th></tr></thead><tbody><tr repeat.for=\"item of result.items\"><td> ${item.product.name} <div><small class=\"boldness-light\">${item.supplier.fantasyName}</small></div></td><td class=\"text-center align-middle\"> ${item.product.description} </td><td class=\"text-center\"> ${item.product.unit.name} </td><td class=\"text-right\"> ${item.price | money} </td><td class=\"text-right\"> ${item.quantity} </td><td class=\"text-right\"> ${item.total | money} </td></tr><tr><td colspan=\"4\" class=\"text-right\"><strong>Total:</strong></td><td class=\"text-right\"><strong>${result.total  | money}</strong></td></tr></tbody></table></div></div></div></div></div></div></div><div class=\"tab-pane\" id=\"tab3\"><div class=\"col-md-12 mt-3\" if.bind=\"isProcessing\"><div class=\"form-group\"><span class=\"badge badge-warning\">Confirme os dados antes de gerar o pedido</span></div></div><div class=\"card-table table-responsive\" repeat.for=\"summary of selectedResult.summaryItems\"><h4><i class=\"fa fa-tag mr-2\"></i> Pedido ${$index + 1} - ${summary.supplier.fantasyName}</h4><h5 class=\"mt-5\">Informações do fornecedor</h5><table class=\"table table-hover table-sm align-middle mt-1\"><thead><tr><th class=\"text-left\">Fornecedor</th><th class=\"text-center\">Avaliação</th><th class=\"text-center\">Qtde de dias para aceite</th><th class=\"text-center\">Período de Aceite</th><th class=\"text-center\">Dias de entrega</th><th class=\"text-center\">Período de Entrega</th><th class=\"text-right\">Total</th></tr></thead><tbody><tr><td> ${summary.supplier.fantasyName} </td><td class=\"text-center\"><i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i></td><td class=\"text-center\"> ${summary.rule.numberOfDaysToAccept} dias</td><td class=\"text-center\"> ${summary.rule.periodToAcceptOrder1 | time} <label class=\"mr-sm-2 ml-2\" for=\"inlineFormCustomSelect\">as</label> ${summary.rule.periodToAcceptOrder2 | time} </td><td class=\"text-center\"><span if.bind=\"summary.rule.deliveryOnMonday\" class=\"badge ${ summary.rule.deliveryOnMonday ? 'badge-success' : 'badge-warning' }\">Segunda-feira</span> <span if.bind=\"summary.rule.deliveryOnTuesday\" class=\"badge ${ summary.rule.deliveryOnTuesday ? 'badge-success' : 'badge-warning' }\">Terça-feira</span> <span if.bind=\"summary.rule.deliveryOnWednesday\" class=\"badge ${ summary.rule.deliveryOnWednesday ? 'badge-success' : 'badge-warning' }\">Quarta-feira</span> <span if.bind=\"summary.rule.deliveryOnThursday\" class=\"badge ${ summary.rule.deliveryOnThursday ? 'badge-success' : 'badge-warning' }\">Quinta-feira</span> <span if.bind=\"summary.rule.deliveryOnFriday\" class=\"badge ${ summary.rule.deliveryOnFriday ? 'badge-success' : 'badge-warning' }\">Sexta-feira</span><br><br><span if.bind=\"summary.rule.deliveryOnSaturday\" class=\"badge ${ summary.rule.deliveryOnSaturday ? 'badge-success' : 'badge-warning' }\">Sábado</span> <span if.bind=\"summary.rule.deliveryOnSunday\" class=\"badge ${ summary.rule.deliveryOnSunday ? 'badge-success' : 'badge-warning' }\">Domingo</span></td><td class=\"text-center\"> ${summary.rule.deliverySchedule1 | time} <label class=\"mr-sm-2 ml-2\" for=\"inlineFormCustomSelect\">as</label> ${summary.rule.deliverySchedule2 | time} </td><td class=\"text-right\"> ${summary.total | money} </td></tr></tbody></table><h5 class=\"mt-5\">Produtos</h5><table class=\"table table-hover mt-1\"><thead><tr><th class=\"text-left\">Nome do Produto</th><th class=\"text-center\">Descrição</th><th class=\"text-center\">UM</th><th class=\"text-right\">Preço unitário</th><th class=\"text-right\">Quantidade</th><th class=\"text-right\">Total</th></tr></thead><tbody><tr repeat.for=\"item of summary.items\"><td> ${item.product.name} </td><td class=\"text-center align-middle\"> ${item.product.description} </td><td class=\"text-center\"> ${item.product.unit.name} </td><td class=\"text-right\"> ${item.price | money} </td><td class=\"text-right\"> ${item.quantity} </td><td class=\"text-right\"> ${item.total | money} </td></tr><tr><td colspan=\"4\" class=\"text-right\"><strong>Total:</strong></td><td class=\"text-right\"><strong>${summary.total  | money}</strong></td></tr></tbody></table></div></div><ul class=\"pager wizard mt-5\"><li class=\"previous\" if.bind=\"currentStep != 1\"><a href=\"#\" class=\"waves-effect waves-light\" click.trigger=\"back()\" if.bind=\"currentStep > 0 \">Voltar</a></li><li class=\"next\" if.bind=\"isOrderValid && currentStep < totalSteps && ( (currentStep != 2) || (currentStep == 2 && selectedResult) ) \"><a href=\"#\" id=\"next\" class=\" ${ ! isOrderValid ? 'disabled' : '' } waves-effect waves-light\" click.trigger=\"advance()\">Avançar</a></li><li class=\"finish float-right\" if.bind=\"currentStep == totalSteps\"><button type=\"button\" class=\"btn btn-success waves-effect waves-light\" if.bind=\"! isProcessing && ! orderWasGenerated\" click.trigger=\"generateOrder()\"><span class=\"gradient\">Gerar pedido</span> <i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i></button><div class=\"fa-2x text-center\" if.bind=\"isProcessing\"><i class=\"fa fa-refresh fa-spin\"></i></div></li></ul></div></div></div></div></div></div></div></div></template>"; });
define('text!views/admin/dashboard.html', ['module'], function(module) { module.exports = "<template><require from=\"jquery-datetimepicker/jquery.datetimepicker.min.css\"></require><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/attributes/datepicker\"></require><require from=\"../components/valueConverters/dateFormatValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"row mb-5\"><div class=\"col-md-6\"><div class=\"card\"><div class=\"card-header\">Exportação de pedidos</div><div class=\"card-body\"><div class=\"row pb-5\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"control-label active\">Informe a data inicial</label> <input type=\"text\" class=\"form-control text-right\" autocomplete=\"off\" placeholder=\"00/00/0000\" value.bind=\"startDate | dateFormat\" datepicker> <label class=\"control-label active\">Informe a data final</label> <input type=\"text\" class=\"form-control text-right\" autocomplete=\"off\" placeholder=\"00/00/0000\" value.bind=\"endDate | dateFormat \" datepicker></div></div></div><div class=\"row\"><button type=\"button\" class=\"btn btn-success mx-auto waves-effect waves-light\" click.trigger=\"exportOrders()\">Exportar</button></div></div></div></div></div></div></div></template>"; });
define('text!views/fornecedor/regrasDeMercado.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/attributes/numberMask\"></require><require from=\"../components/attributes/timeMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/valueConverters/numberValueConverter\"></require><require from=\"../components/valueConverters/timeValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Regras de Mercado</div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12\"><h2>1. Pedido</h2><div class=\"form-inline\"><div class=\"col-md-4\"><label class=\"mr-sm-2 float-right\" for=\"inlineFormCustomSelect\">Valor mínimo</label></div><div class=\"col-md-4\"><div class=\"input-group\"><span class=\"input-group-addon\">$</span> <input type=\"text\" class=\"money form-control ${validator.isMinimumOrderValueInvalid  ? 'border-danger' : '' } \" autocomplete=\"off\" money placeholder=\"000,00\" value.bind=\"rule.minimumOrderValue | money\" change.delegate=\"validator.validateMinimumOrderValue()\"></div></div></div><br><br><div class=\"form-inline\"><div class=\"col-md-4\"><label class=\"mr-sm-2 float-right\" for=\"inlineFormCustomSelect\">Qtde de dias para aceite</label></div><div class=\"col-md-2\"><div class=\"input-group\"><input type=\"text\" class=\"money form-control ${validator.isnumberOfDaysToAcceptInvalid  ? 'border-danger' : '' } \" autocomplete=\"off\" number value.bind=\"rule.numberOfDaysToAccept | number\" change.delegate=\"validator.validateNumberOfDaysToAccept()\"></div></div></div><br><br><div class=\"form-inline\"><div class=\"col-md-4\"><label class=\"mr-sm-2 float-right\" for=\"inlineFormCustomSelect\">Período de Aceite</label></div><div class=\"col-md-4\"><div class=\"input-group\"><span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control ${validator.isPeriodToAcceptOrder1Invalid  ? 'border-danger' : '' } \" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"rule.periodToAcceptOrder1 | time & updateTrigger:'blur' \" change.delegate=\"validator.validatePeriodToAcceptOrder1()\"> <label class=\"mr-sm-2 ml-2\" for=\"inlineFormCustomSelect\">as</label> <span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control ${validator.isPeriodToAcceptOrder2Invalid  ? 'border-danger' : '' } \" autocomplete=\"off\" placeholder=\"HH:mm\" maxlength=\"8\" time value.bind=\"rule.periodToAcceptOrder2 | time & updateTrigger:'blur' \" change.delegate=\"validator.validatePeriodToAcceptOrder2()\"></div></div></div></div><div class=\"col-md-12 mt-5\"><h2>2. Entrega</h2><div class=\"form-inline\"><div class=\"col-md-4\"><label class=\"mr-sm-2 float-right\" for=\"inlineFormCustomSelect\">Dias de entrega</label></div><div class=\"col-md-4\"><div class=\"input-group\"><div class=\"form-check form-check-inline\"><label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"0\" checked.bind=\"rule.deliveryOnMonday\"> <span class=\"badge ${ rule.deliveryOnMonday ? 'badge-success' : 'badge-warning' }\">Segunda-feira</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"1\" checked.bind=\"rule.deliveryOnTuesday\"> <span class=\"badge ${ rule.deliveryOnTuesday ? 'badge-success' : 'badge-warning' }\">Terça-feira</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"2\" checked.bind=\"rule.deliveryOnWednesday\"> <span class=\"badge ${ rule.deliveryOnWednesday ? 'badge-success' : 'badge-warning' }\">Quarta-feira</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"3\" checked.bind=\"rule.deliveryOnThursday\"> <span class=\"badge ${ rule.deliveryOnThursday ? 'badge-success' : 'badge-warning' }\">Quinta-feira</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"4\" checked.bind=\"rule.deliveryOnFriday\"> <span class=\"badge ${ rule.deliveryOnFriday ? 'badge-success' : 'badge-warning' }\">Sexta-feira</span></label></div></div><br><div class=\"input-group\"><div class=\"form-check form-check-inline\"><label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"5\" checked.bind=\"rule.deliveryOnSaturday\"> <span class=\"badge ${ rule.deliveryOnSaturday ? 'badge-success' : 'badge-warning' }\">Sábado</span></label> <label class=\"form-check-label ml-2\"><input class=\"form-check-input\" type=\"checkbox\" value=\"6\" checked.bind=\"rule.deliveryOnSunday\"> <span class=\"badge ${ rule.deliveryOnSunday ? 'badge-success' : 'badge-warning' }\">Domingo</span></label></div></div></div></div><br><br><div class=\"form-inline\"><div class=\"col-md-4\"><label class=\"mr-sm-2 float-right\" for=\"inlineFormCustomSelect\">Período de Entrega</label></div><div class=\"col-md-4\"><div class=\"input-group\"><span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control ${validator.isDeliverySchedule1Invalid  ? 'border-danger' : '' } \" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"rule.deliverySchedule1 | time & updateTrigger:'blur' \" change.delegate=\"validator.validateDeliverySchedule1()\"> <label class=\"mr-sm-2 ml-2\" for=\"inlineFormCustomSelect\">as</label> <span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control ${validator.isDeliverySchedule2Invalid ? 'border-danger' : '' }\" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"rule.deliverySchedule2 | time & updateTrigger:'blur' \" change.delegate=\"validator.validateDeliverySchedule2()\"></div></div></div></div><div class=\"col-md-12 mt-5\"><h2>3. Alertas</h2><div class=\"form-inline\"><div class=\"col-md-4\"></div><div class=\"col-md-6\"><label class=\"form-check-label ml-2 float-left\"><input class=\"form-check-input float-left\" type=\"checkbox\" value=\"0\" checked.bind=\"rule.sendNotificationToNewClient\"> <label class=\"mr-sm-2 float-right\" for=\"inlineFormCustomSelect\">Receber notificação de um novo cliente por email</label></label></div></div><br><div class=\"form-inline\"><div class=\"col-md-4\"></div><div class=\"col-md-4\"><div class=\"input-group\"><input type=\"email\" class=\"form-control ${validator.sendNotificationToNewClient  ? 'border-danger' : '' } \" autocomplete=\"off\" data-validation=\"email\" if.bind=\"rule.sendNotificationToNewClient\" value.bind=\"rule.receiverNewClient\" change.delegate=\"validator.validateReceiverNewClient()\"></div></div></div><br><div class=\"form-inline\"><div class=\"col-md-4\"></div><div class=\"col-md-6\"><label class=\"form-check-label ml-2 float-left\"><input class=\"form-check-input float-left\" type=\"checkbox\" value=\"0\" checked.bind=\"rule.sendNotificationToNewOrder\"> <label class=\"mr-sm-2 float-right\" for=\"inlineFormCustomSelect\">Receber notificação de um novo pedido por email</label></label></div></div><br><div class=\"form-inline\"><div class=\"col-md-4\"></div><div class=\"col-md-4\"><div class=\"input-group\"><input type=\"email\" class=\"form-control ${validator.sendNotificationToNewOrder  ? 'border-danger' : '' } \" autocomplete=\"off\" data-validation=\"email\" if.bind=\"rule.sendNotificationToNewOrder\" value.bind=\"rule.receiverNewOrder\" change.delegate=\"validator.validateReceiverNewOrder()\"></div></div></div></div></div><div class=\"row mt-5\"><button type=\"button\" class=\"btn btn-primary btn-gradient assign-task waves-effect waves-light mx-auto\" click.trigger=\"save()\" if.bind=\"! isLoading\"><span class=\"gradient\">Salvar</span></button><div class=\"fa-2x text-center mx-auto\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></div></template>"; });
define('text!views/fornecedor/evaluations.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"../components/valueConverters/cellPhoneWithDDDValueConverter\"></require><require from=\"../components/valueConverters/cnpjValueConverter\"></require><require from=\"../components/valueConverters/cepValueConverter\"></require><require from=\"../components/valueConverters/dateFormatValueConverter\"></require><require from=\"../components/attributes/cnpjMask\"></require><require from=\"../components/attributes/cepMask\"></require><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Avaliações</div><div class=\"card-body\"><div if.bind=\"! evaluation\"><table class=\"table table-hover mt-2\"><thead><tr><th class=\"text-center\">Nº pedido</th><th class=\"text-right\">Valor do pedido</th><th class=\"text-center\">Food Service</th><th class=\"text-center\">Fornecedor</th><th class=\"text-center\">Data da avaliação</th><th class=\"text-center\" style=\"min-width:250px\">Avaliação</th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredEvaluations\"><td class=\"text-center\">${x.order.code}</td><td class=\"text-right\">${x.order.total | money}</td><td class=\"text-center\">${x.foodService.name}</td><td class=\"text-center\">${x.supplier.name}</td><td class=\"text-center\">${x.createdOn | dateFormat}</td><td class=\"text-center\"><i class=\"batch-icon ${ x.rating >= 1 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 2 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 3 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 4 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 5 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light mx-auto ml-2\" click.trigger=\"showDetails(x)\" if.bind=\"! x.processing\">Detalhes</button></td></tr></tbody></table></div><div if.bind=\"evaluation\"><div class=\"row mt-3\"><div class=\"col-md-12\"><h6 class=\"mt-5 mb-5\"><i class=\"batch-icon batch-icon-users mr-2\"></i>Dados do Food Service</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome</label> <label class=\"control-label col-md-6\">${evaluation.foodService.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Comercial</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.commercialPhone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">E-mail</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.email}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.phone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Celular</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.personalPhone | phoneWithDDD}</label></div></div></div></div><div class=\"col-md-12\"><h6 class=\"mt-5 mb-5\"><i class=\"batch-icon batch-icon-users mr-2\"></i>Dados do Fornecedor</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome</label> <label class=\"control-label col-md-6\">${evaluation.supplier.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Comercial</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.commercialPhone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">E-mail</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.email}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.phone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Celular</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.personalPhone | phoneWithDDD}</label></div></div></div></div><div class=\"col-md-12 mt-5\"><div class=\"form-group mx-auto text-center\"><h5 class=\"text-center\">Nota da avaliação</h5><i class=\"batch-icon ${ evaluation.rating  >= 1 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl mt-2\"></i> <i class=\"batch-icon ${ evaluation.rating >= 2 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl\"></i> <i class=\"batch-icon ${ evaluation.rating >= 3 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl\"></i> <i class=\"batch-icon ${ evaluation.rating >= 4 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl\"></i> <i class=\"batch-icon ${ evaluation.rating >= 5 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl mb-2\"></i></div></div><div class=\"col-md-12 mt-3\"><div class=\"form-group mx-auto\"><label class=\"control-label\">Comentários</label> <textarea class=\"form-control disabled\" disabled=\"disabled\" value.bind=\"evaluation.comment\" rows=\"2\"></textarea></div></div></div><div class=\"text-center\"><button type=\"button\" class=\"btn btn-secondary waves-effect waves-light ml-2\" click.trigger=\"evaluation = null\" if.bind=\"! evaluation.processing\"><i class=\"fa fa-undo mr-2\"></i>Voltar</button></div></div></div></div></div></div></template>"; });
define('text!views/fornecedor/dashboard.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/valueConverters/dateFormatValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"row\"><div class=\"col-md-6 col-lg-6 col-xl-3 mb-5\"><div class=\"card card-tile card-xs bg-primary bg-gradient text-center\"><div class=\"card-body p-4\"><div class=\"tile-left\"><i class=\"batch-icon batch-icon-users batch-icon-xxl\"></i></div><div class=\"tile-right\"><div class=\"tile-number\"><i class=\"fa fa-refresh fa-spin\" if.bind=\"isLoadingNumberOfCustomers\"></i> <span if.bind=\"! isLoadingNumberOfCustomers\">${numberOfCustomers.count}</span></div><div class=\"tile-description\">Clientes cadastrados</div></div></div></div></div><div class=\"col-md-6 col-lg-6 col-xl-3 mb-5\"><div class=\"card card-tile card-xs bg-secondary bg-gradient text-center\"><div class=\"card-body p-4\"><div class=\"tile-left\"><i class=\"batch-icon batch-icon-tag-alt-2 batch-icon-xxl\"></i></div><div class=\"tile-right\"><div class=\"tile-number\"><i class=\"fa fa-refresh fa-spin\" if.bind=\"isLoadingNumberOfOrders\"></i> <span if.bind=\"! isLoadingNumberOfOrders\">${numberOfOrders.total | money }</span></div><div class=\"tile-description\">Valor total dos pedidos</div></div></div></div></div><div class=\"col-md-6 col-lg-6 col-xl-3 mb-5\"><div class=\"card card-tile card-xs bg-secondary bg-gradient text-center\"><div class=\"card-body p-4\"><div class=\"tile-left\"><i class=\"batch-icon batch-icon-star batch-icon-xxl\"></i></div><div class=\"tile-right\"><div class=\"tile-number\"><i class=\"fa fa-refresh fa-spin\" if.bind=\"isLoadingNumberOfOrders\"></i> <span if.bind=\"! isLoadingNumberOfOrders\">${numberOfOrders.count}</span></div><div class=\"tile-description\">Pedidos recebidos</div></div></div></div></div></div><div class=\"row\"><div class=\"col-md-6 col-lg-6 col-xl-8 mb-5\"><div class=\"card\"><div class=\"card-header\">Pedidos<div class=\"header-btn-block\"><span class=\"data-range dropdown\"><a href=\"#\" class=\"btn btn-primary dropdown-toggle waves-effect waves-light\" id=\"navbar-dropdown-sales-overview-header-button\" data-toggle=\"dropdown\" data-flip=\"false\" aria-haspopup=\"true\" aria-expanded=\"false\"><i class=\"batch-icon batch-icon-calendar\"></i></a><div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbar-dropdown-sales-overview-header-button\"><a class=\"dropdown-item\" href=\"#\" click.trigger=\"loadOrdersValues(1)\">Ano</a> <a class=\"dropdown-item\" href=\"#\" click.trigger=\"loadOrdersValues(0)\">Mês</a> <a class=\"dropdown-item\" href=\"#\" click.trigger=\"loadOrdersValues(2)\">Início</a></div></span></div></div><div class=\"card-body\"><span class=\"fa-5x\" style=\"position:absolute;top:20%;left:50%\" if.bind=\"! pedidosChart\"><i class=\"fa fa-refresh fa-spin\"></i></span><div class=\"card-chart\" data-chart-color-1=\"#07a7e3\" data-chart-color-2=\"#32dac3\" data-chart-legend-1=\"Sales ($)\" data-chart-legend-2=\"Orders\" data-chart-height=\"281\"><canvas id=\"pedidos\" style=\"display:block\"></canvas></div></div></div></div><div class=\"col-md-6 col-lg-6 col-xl-4 mb-5\"><div class=\"card card-md\"><div class=\"card-header\">Últimas avaliações</div><div class=\"card-body text-center\"><span class=\"fa-5x\" style=\"position:absolute;top:20%;left:50%\" if.bind=\"! evaluations\"><i class=\"fa fa-refresh fa-spin\"></i></span><table class=\"table table-hover mt-2\" if.bind=\"evaluations\"><thead><tr><th class=\"text-center\">Food Service</th><th class=\"text-center\" style=\"min-width:250px\">Avaliação</th><th></th></tr></thead><tbody><tr repeat.for=\"x of evaluations\"><td class=\"text-center\">${x.foodService.name}</td><td class=\"text-center\"><i class=\"batch-icon ${ x.rating >= 1 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 2 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 3 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 4 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i class=\"batch-icon ${ x.rating >= 5 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i></td></tr></tbody></table></div></div></div></div><div class=\"row mb-5\"><div class=\"col-md-4\"><div class=\"card card-md\"><div class=\"card-header\">Principais Clientes<div class=\"header-btn-block\"><span class=\"data-range dropdown\"><a href=\"#\" class=\"btn btn-primary dropdown-toggle\" id=\"navbar-dropdown-traffic-sources-header-button\" data-toggle=\"dropdown\" data-flip=\"false\" aria-haspopup=\"true\" aria-expanded=\"false\"><i class=\"batch-icon batch-icon-calendar\"></i></a><div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbar-dropdown-traffic-sources-header-button\"><a class=\"dropdown-item\" href=\"#\" click.trigger=\"loadMainClients(1)\">Ano</a> <a class=\"dropdown-item\" href=\"#\" click.trigger=\"loadMainClients(0)\">Mês</a> <a class=\"dropdown-item\" href=\"#\" click.trigger=\"loadMainClients(2)\">Início</a></div></span></div></div><div class=\"card-body text-center\"><span class=\"fa-5x\" style=\"position:absolute;top:20%;left:50%\" if.bind=\"! clientesChart\"><i class=\"fa fa-refresh fa-spin\"></i></span><div class=\"card-chart\" data-chart-color-1=\"#07a7e3\" data-chart-color-2=\"#32dac3\" data-chart-color-3=\"#4f5b60\" data-chart-color-4=\"#FCCF31\" data-chart-color-5=\"#f43a59\"><canvas id=\"principaisClientesChart\"></canvas></div></div></div></div><div class=\"col-md-4\"><div class=\"card card-md\"><div class=\"card-header\">Produtos mais vendidos</div><div class=\"card-body text-center\"><span class=\"fa-5x\" style=\"position:absolute;top:20%;left:50%\" if.bind=\"! produtosChart\"><i class=\"fa fa-refresh fa-spin\"></i></span><div class=\"card-body text-center\"><div class=\"card-chart\" data-chart-color-1=\"#07a7e3\" data-chart-color-2=\"#32dac3\" data-chart-color-3=\"#4f5b60\" data-chart-color-4=\"#FCCF31\" data-chart-color-5=\"#f43a59\"><canvas id=\"principaisProdutosChart\"></canvas></div></div></div></div></div></div></div></div></template>"; });
define('text!views/fornecedor/clientes.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/cnpjMask\"></require><require from=\"../components/attributes/phoneWithDDDMask\"></require><require from=\"../admin/foodService/editFoodService\"></require><div class=\"row mb-5 task-manager au-animate\" if.bind=\"! showDetails\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\"> ${title} </div><div class=\"card-body\"><form><div class=\"form-row align-items-center\"><div class=\"col-lg-3\"><label for=\"input-task-title\" class=\"active\">Filtro</label> <select class=\"form-control\" value.bind=\"tipoFiltro\" change.delegate=\"alterView()\"><option value=\"0\">Novos Clientes</option><option value=\"1\">Aguardando aprovação</option><option value=\"2\">Meus Clientes</option><option value=\"3\">Clientes Bloqueados</option></select></div><div class=\"col-lg-3\"><label for=\"input-task-title\" class=\"active\">Nome do cliente</label> <input type=\"text\" class=\"form-control input-task-title\" id=\"input-task-title\" placeholder=\"nome...\" change.trigger=\"search()\" value.bind=\"filter\"></div><div class=\"col-lg-3 ml-4 mt-3 fa-2x text-center\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div><div class=\"col-lg-3 ml-4 mt-3\" if.bind=\"! processing\"><button type=\"button\" class=\"btn btn-primary btn-gradient assign-task waves-effect waves-light\"><span class=\"gradient\">Pesquisar</span></button></div></div></form></div><div class=\"card-body\"><table class=\"table table-hover\"><thead><tr><th>Nome do cliente</th><th>Situação Cadastral</th><th>Contato</th><th>E-mail</th><th>Telefone</th><th>CNPJ</th><th></th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredFoodServices\"><td>${x.foodService.name}</td><td><span class=\"badge badge-danger\" if.bind=\"x.status == 1\">Não cadastrado</span> <span class=\"badge badge-success\" if.bind=\"x.status == 2\">Cadastrado</span> <span class=\"badge badge-default\" if.bind=\"x.status == 3\">Rejeitado</span> <span class=\"badge badge-default\" if.bind=\"x.status == 4\">Bloqueado</span> <span class=\"badge badge-warning\" if.bind=\"x.status == 5\">Aguardando aprovação</span></td><td>${x.foodService.contact.name}</td><td>${x.foodService.contact.email}</td><td phone-with-ddd>${x.foodService.contact.phone}</td><td cnpj>${x.foodService.cnpj}</td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" if.bind=\"x.status == 1 && ! x.isLoading\" click.trigger=\"registrationSent(x)\">Cadastro recebido</button> <button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" if.bind=\"(x.status == 5 || x.status == 3) && ! x.isLoading\" click.trigger=\"approve(x)\">Aprovar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status == 5 && ! x.isLoading\" click.trigger=\"reject(x)\">Rejeitar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status == 2 && ! x.isLoading\" click.trigger=\"block(x)\">Bloquear</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" if.bind=\"x.status == 4 && ! x.isLoading\" click.trigger=\"unblock(x)\">Desbloquear</button> <button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"showFoodServiceDetails(x)\">Detalhes</button></td><td><div class=\"fa-2x text-center ${x.isLoading  == true ? '' : 'invisible'}\"><i class=\"fa fa-refresh fa-spin\"></i></div></td></tr></tbody></table></div></div></div></div><div class=\" ${ showDetails ? '' : 'invisible' }\" class=\"au-animate\"><edit-food-service></edit-food-service></div></template>"; });
define('text!views/fornecedor/produtos.html', ['module'], function(module) { module.exports = "<template><require from=\"../components/attributes/moneyMask\"></require><require from=\"../components/attributes/numberMask\"></require><require from=\"../components/attributes/timeMask\"></require><require from=\"../components/valueConverters/moneyValueConverter\"></require><require from=\"../components/valueConverters/numberValueConverter\"></require><require from=\"../components/valueConverters/timeValueConverter\"></require><div class=\"row mb-5 au-animate\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Produtos</div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12 pb-5\"><ul class=\"nav nav-tabs\" id=\"myTab-1\" role=\"tablist\"><li class=\"nav-item waves-effect waves-light\"><a class=\"nav-link active\" href=\"#tab-1-1\" data-toggle=\"tab\" role=\"tab\" aria-controls=\"tab-1-1\" aria-selected=\"true\" aria-expanded=\"true\"><i class=\"batch-icon batch-icon-list-alt mr-2\"></i> Seleção de Produtos</a></li><li class=\"nav-item waves-effect waves-light\"><a class=\"nav-link\" href=\"#tab-1-2\" data-toggle=\"tab\" role=\"tab\" aria-controls=\"tab-1-2\" aria-selected=\"false\" aria-expanded=\"false\"><i class=\"batch-icon batch-icon-pencil mr-2\"></i> Atualização de Preços <span class=\"badge badge-warning\" if.bind=\"productAddedCount > 0\">${productAddedCount}</span></a></li><li class=\"nav-item waves-effect waves-light\"><a class=\"nav-link\" href=\"#tab-1-3\" data-toggle=\"tab\" role=\"tab\" aria-controls=\"tab-1-3\" aria-selected=\"false\"><i class=\"batch-icon batch-icon-cloud-upload mr-2\"></i> Histórico de Importação</a></li><li class=\"nav-item waves-effect waves-light\"><a class=\"nav-link\" href=\"#tab-1-4\" data-toggle=\"tab\" role=\"tab\" aria-controls=\"tab-1-4\" aria-selected=\"false\"><i class=\"batch-icon batch-icon-list mr-2\"></i> Lista de Preços</a></li></ul><div class=\"tab-content\" id=\"myTabContent-1\"><div class=\"tab-pane fade active show\" id=\"tab-1-1\" role=\"tabpanel\" aria-labelledby=\"tab-1-1\" aria-expanded=\"true\"><p class=\"p-3\"><require from=\"../components/partials/selecaoDeProdutos\"></require><selecao-de-produtos containerless></selecao-de-produtos></p></div><div class=\"tab-pane fade\" id=\"tab-1-2\" role=\"tabpanel\" aria-labelledby=\"tab-1-2\" aria-expanded=\"false\"><p class=\"p-3\"><require from=\"../components/partials/atualizacaoDePrecos\"></require><atualizacao-de-precos containerless></atualizacao-de-precos></p></div><div class=\"tab-pane fade\" id=\"tab-1-3\" role=\"tabpanel\" aria-labelledby=\"tab-1-3\"><p class=\"p-3\"><require from=\"../components/partials/historicoDeImportacao\"></require><historico-de-importacao containerless></historico-de-importacao></p></div><div class=\"tab-pane fade\" id=\"tab-1-4\" role=\"tabpanel\" aria-labelledby=\"tab-1-7\"><p class=\"p-4\"><require from=\"../components/partials/listaDePrecos\"></require><lista-de-precos containerless></lista-de-precos></p></div></div></div></div></div></div></div></div></template>"; });
define('text!views/admin/foodService/editFoodService.html', ['module'], function(module) { module.exports = "<template><require from=\"../../components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"../../components/valueConverters/cellPhoneWithDDDValueConverter\"></require><require from=\"../../components/valueConverters/cnpjValueConverter\"></require><require from=\"../../components/valueConverters/cepValueConverter\"></require><require from=\"../../components/valueConverters/inscricaoEstadualValueConverter\"></require><require from=\"../../components/attributes/cnpjMask\"></require><require from=\"../../components/attributes/cepMask\"></require><require from=\"../../components/attributes/inscricaoEstadualMask\"></require><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Edição de Food Service</div><div class=\"card-body\"><h4>Dados básicos</h4><div class=\"row mt-4\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Razão Social<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" value.bind=\"foodService.name\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome Fantasia<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" value.bind=\"foodService.fantasyName\"></div></div></div><div class=\"row mt-4\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">CNPJ<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" value.bind=\"foodService.cnpj | cnpj\" cnpj></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Inscrição Estadual<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" inscricaoestadual value.bind=\"foodService.inscricaoEstadual | inscricaoEstadual\"></div></div></div><h4 class=\"mt-4\">Endereço</h4><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">CEP</label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" cep value.bind=\"foodService.address.cep | cep\" change.delegate=\"consultaCEP()\"></div></div></div><div class=\"row mt-4\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Logradouro</label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" value.bind=\"foodService.address.logradouro\"></div><div class=\"form-group\"><label class=\"control-label\">Bairro</label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" value.bind=\"foodService.address.neighborhood\"></div><div class=\"form-group\"><label class=\"control-label\">Estado</label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" value.bind=\"foodService.address.state\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Número</label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" value.bind=\"foodService.address.number\"></div><div class=\"form-group\"><label class=\"control-label\">Complemento</label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" value.bind=\"foodService.address.complement\"></div><div class=\"form-group\"><label class=\"control-label\">Cidade</label> <input type=\"text\" class=\"form-control\" disabled.bind=\"! edit\" value.bind=\"foodService.address.city\"></div></div></div><h4 class=\"mt-4\">Contato</h4><div class=\"tab-pane\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isNameInvalid  ? 'border-danger' : '' }\" disabled.bind=\"! edit\" value.bind=\"foodService.contact.name\" change.delegate=\"validator.contactValidator.validateName()\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Comercial</label> <input type=\"text\" class=\"form-control\" phone-with-ddd value.bind=\"foodService.contact.commercialPhone | phoneWithDDD\" disabled.bind=\"! edit\" placeholder=\"(01) 1234-5678\"></div><div class=\"form-group\"><label class=\"control-label\">E-mail</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isEmailInvalid  ? 'border-danger' : '' } \" disabled.bind=\"! edit\" value.bind=\"foodService.contact.email\" change.delegate=\"validator.contactValidator.validateEmail()\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Telefone</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isPhoneInvalid  ? 'border-danger' : '' } \" disabled.bind=\"! edit\" phone-with-ddd value.bind=\"foodService.contact.phone | phoneWithDDD\" change.delegate=\"validator.contactValidator.validatePhone()\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Celular</label> <input type=\"text\" class=\"form-control\" cell-phone-with-ddd value.bind=\"foodService.contact.personalPhone | cellPhoneWithDDD\" disabled.bind=\"! edit\" placeholder=\"(01) 01234-5678\"></div></div></div></div><h4 class=\"mt-4\">Contrato Social</h4><div class=\"tab-pane\" id=\"tab3\"><div class=\"row\"><div class=\"col-md-6\" if.bind=\"selectedFiles == null || selectedFiles.length == 0\"><div class=\"form-group\"><button type=\"button\" class=\"btn btn-primary waves-effect waves-light col-md-6\" click.trigger=\"downloadSocialContract()\"><i class=\"batch-icon batch-icon-cloud-download\"></i> Download</button></div></div><div class=\"col-md-6\" if.bind=\"edit\"><div class=\"form-group\"><form submit.delegate=\"uploadSocialContract()\"><button type=\"submit\" if.bind=\"selectedFiles.length > 0\" class=\"btn ${ ! isUploading ? 'btn-primary' : 'btn-warning'} waves-effect waves-light col-md-6\" disable.bind=\"isUploading\"><span if.bind=\"! isUploading\"><i class=\"batch-icon batch-icon-cloud-upload\"></i> Upload </span><span if.bind=\"isUploading\"><i class=\"fa fa-circle-o-notch fa-spin\"></i> Processando arquivo</span></button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light\" if.bind=\"selectedFiles != null && selectedFiles.length > 0\" click.trigger=\"cancelUpload()\">Cancelar</button> <input id=\"files\" type=\"file\" accept=\".pdf\" files.bind=\"selectedFiles\" class=\"${ isUploading || (selectedFiles != null && selectedFiles.length > 0) ? 'invisible' : ''} mt-4\"></form></div></div></div></div><h4 class=\"mt-4\" if.bind=\"edit\">Usuários</h4><span class=\"badge badge-warning mt-2 mb-2\" if.bind=\"foodService.status != 0 && edit \">Para poder criar usuários faça a ativação do cadastro</span><div class=\"tab-pane\" if.bind=\"foodService.status != 2 && edit \"><div class=\"row\"><table class=\"table table-hover\"><thead><tr><th>Nome</th><th>E-mail</th><th>Status</th><th></th></tr></thead><tbody><tr repeat.for=\"x of users\"><td><span if.bind=\"! x.isEditing\">${x.name}</span><input type=\"text\" class=\"form-control col-md-8\" if.bind=\"x.isEditing\" value.bind=\"x.name\"></td><td><span if.bind=\"! x.isEditing\">${x.email}</span><input type=\"text\" class=\"form-control col-md-8\" if.bind=\"x.isEditing\" value.bind=\"x.email\"></td><td><span class=\"badge badge-success\" if.bind=\"x.status == 0\">Ativo</span> <span class=\"badge badge-danger\" if.bind=\"x.status == 1\">Inativo</span> <span class=\"badge badge-warning\" if.bind=\"x.status == 2\">Aguardando confirmação</span></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" if.bind=\"x.isEditing && foodService.status == 0\" click.trigger=\"saveEditUser(x)\">Salvar</button> <button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" if.bind=\"! x.isEditing  && foodService.status == 0\" click.trigger=\"editUser(x)\">Editar</button> <button type=\"button\" class=\"btn btn-secondary btn-sm waves-effect waves-light\" if.bind=\"  x.isEditing  && foodService.status == 0\" click.trigger=\"cancelEditUser(x)\">Cancelar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status == 0 && ! x.isEditing && foodService.status == 0\" click.trigger=\"editUserStatus(x, 1)\">Inativar</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" if.bind=\"x.status == 1 && ! x.isEditing  && foodService.status == 0\" click.trigger=\"editUserStatus(x, 0)\">Ativar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status == 2  && !    x.isEditing  && foodService.status == 0\" click.trigger=\"resendInvite(x)\">Reenviar convite</button></td></tr><tr if.bind=\"foodService.status == 0\"><td><input type=\"text\" class=\"form-control col-md-8\" value.bind=\"user.name\"></td><td><input type=\"text\" class=\"form-control col-md-8\" value.bind=\"user.email\"></td><td></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"createUser()\">Criar</button></td></tr></tbody></table></div></div></div><div class=\"row mt-5 mb-5 mx-auto\"><button type=\"button\" class=\"btn btn-primary btn-gradient waves-effect waves-light\" if.bind=\"edit\" click.trigger=\"save()\"><span class=\"gradient\">Salvar</span></button> <button type=\"button\" class=\"btn btn-success ml-2 waves-effect waves-light\" if.bind=\"foodService.status != 0 && edit\" click.trigger=\"editStatus(0)\">Ativar</button> <button type=\"button\" class=\"btn btn-danger ml-2 waves-effect waves-light\" if.bind=\"foodService.status == 0 && edit \" click.trigger=\"editStatus(1)\">Inativar</button> <button type=\"button\" class=\"btn btn-secondary ml-2 waves-effect waves-light\" if.bind=\"edit\" click.trigger=\"cancel()\">Cancelar</button> <button type=\"button\" class=\"btn btn-secondary ml-2 waves-effect waves-light\" if.bind=\"! edit\" click.trigger=\"cancelShowDetails()\">Cancelar</button></div></div></div></div></template>"; });
define('text!views/admin/foodService/listFoodServices.html', ['module'], function(module) { module.exports = "<template><require from=\"../../components/valueConverters/phoneWithDDDValueConverter\"></require><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Food Services</div><div class=\"card-body\"><div if.bind=\"! isEditing\"><div class=\"row mt-2\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Filtro</label> <input type=\"text\" class=\"form-control\" value.bind=\"filter\" placeholder=\"Pesquise por Nome/ Contato\" change.trigger=\"search()\"></div></div><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Status</label> <select class=\"form-control\" value.bind=\"selectedStatus\" change.delegate=\"search()\"><option value=\"\"></option><option value=\"0\">Ativos</option><option value=\"1\">Inativos</option><option value=\"2\">Aguardando liberação</option></select></div></div></div><table class=\"table table-hover\"><thead><tr><th>Nome</th><th>Contato</th><th>E-mail</th><th>Telefone</th><th>Status</th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredFoodServices\"><td>${x.name}</td><td>${x.contact.name}</td><td>${x.contact.email}</td><td>${x.contact.phone  | phoneWithDDD }</td><td><span class=\"badge badge-success\" if.bind=\"x.status == 0\">Ativo</span> <span class=\"badge badge-danger\" if.bind=\"x.status == 1\">Inativo</span> <span class=\"badge badge-warning\" if.bind=\"x.status == 2\">Aguardando liberação</span></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"edit(x)\">Editar</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" if.bind=\"x.status != 0\" click.trigger=\"editStatus(x, 0)\">Ativar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status == 0\" click.trigger=\"editStatus(x, 1)\">Inativar</button></td></tr></tbody></table></div></div></div></div></div></template>"; });
define('text!views/admin/supplier/evaluations.html', ['module'], function(module) { module.exports = "<template><require from=\"../../components/attributes/moneyMask\"></require><require from=\"../../components/valueConverters/moneyValueConverter\"></require><require from=\"../../components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"../../components/valueConverters/cellPhoneWithDDDValueConverter\"></require><require from=\"../../components/valueConverters/cnpjValueConverter\"></require><require from=\"../../components/valueConverters/cepValueConverter\"></require><require from=\"../../components/valueConverters/dateFormatValueConverter\"></require><require from=\"../../components/attributes/cnpjMask\"></require><require from=\"../../components/attributes/cepMask\"></require><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Avaliações</div><div class=\"card-body\"><div if.bind=\"! evaluation\"><div class=\"row mt-2\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Status</label> <select class=\"form-control\" value.bind=\"selectedStatus\" change.delegate=\"load()\"><option value=\"0\">Novos</option><option value=\"1\">Aprovados</option><option value=\"2\">Rejeitados</option></select></div></div></div><table class=\"table table-hover mt-2\"><thead><tr><th class=\"text-center\">Nº pedido</th><th class=\"text-right\">Valor do pedido</th><th class=\"text-center\">Food Service</th><th class=\"text-center\">Fornecedor</th><th>Avaliador</th><th class=\"text-center\">Data da avaliação</th><th class=\"text-center\" style=\"min-width:250px\">Avaliação</th><th>Status</th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredEvaluations\"><td class=\"text-center\">${x.order.code}</td><td class=\"text-right\">${x.order.total | money}</td><td class=\"text-left\">${x.foodService.name}</td><td class=\"text-left\">${x.supplier.name}</td><td>${x.createdBy.name}</td><td class=\"text-center\">${x.createdOn | dateFormat}</td><td class=\"text-center\"><i style=\"cursor:pointer\" class=\"batch-icon ${ x.rating >= 1 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i style=\"cursor:pointer\" class=\"batch-icon ${ x.rating >= 2 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i style=\"cursor:pointer\" class=\"batch-icon ${ x.rating >= 3 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i style=\"cursor:pointer\" class=\"batch-icon ${ x.rating >= 4 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i> <i style=\"cursor:pointer\" class=\"batch-icon ${ x.rating >= 5 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\"></i></td><td><span class=\"badge badge-warning\" if.bind=\"x.status == 0\">Novo</span> <span class=\"badge badge-success\" if.bind=\"x.status == 1\">Aprovado</span> <span class=\"badge badge-danger\" if.bind=\"x.status == 2 || x.status == 3\">Rejeitado</span></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light mx-auto ml-2\" click.trigger=\"showDetails(x)\" if.bind=\"! x.processing\">Detalhes</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light mx-auto\" click.trigger=\"reject(x)\" if.bind=\"! x.processing && (x.status == 1)\"><i class=\"fa fa-times mr-2\" aria-hidden=\"true\"></i> Rejeitar</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light mx-auto ml-2\" click.trigger=\"approve(x)\" if.bind=\"! x.processing && (  x.status == 2  || x.status == 3)\"><i class=\"fa fa-check mr-2\"></i>Aprovar</button><div class=\"fa-2x text-center mx-auto\" if.bind=\"x.processing\"><i class=\"fa fa-refresh fa-spin\"></i></div></td></tr></tbody></table></div><div if.bind=\"evaluation\"><div class=\"row mt-3\"><div class=\"col-md-12\"><h6 class=\"mt-5 mb-5\"><i class=\"batch-icon batch-icon-users mr-2\"></i>Dados do Food Service</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome</label> <label class=\"control-label col-md-6\">${evaluation.foodService.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Comercial</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.commercialPhone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">E-mail</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.email}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.phone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Celular</label> <label class=\"control-label col-md-6\">${evaluation.foodService.contact.personalPhone | phoneWithDDD}</label></div></div></div></div><div class=\"col-md-12\"><h6 class=\"mt-5 mb-5\"><i class=\"batch-icon batch-icon-users mr-2\"></i>Dados do Fornecedor</h6><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Nome</label> <label class=\"control-label col-md-6\">${evaluation.supplier.name}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Comercial</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.commercialPhone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">E-mail</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.email}</label></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.phone | phoneWithDDD}</label></div><div class=\"form-group\"><label class=\"control-label col-md-6\">Telefone Celular</label> <label class=\"control-label col-md-6\">${evaluation.supplier.contact.personalPhone | phoneWithDDD}</label></div></div></div></div><div class=\"col-md-12 mt-5\"><div class=\"form-group mx-auto text-center\"><h5 class=\"text-center\">Nota da avaliação</h5><i class=\"batch-icon ${ evaluation.rating  >= 1 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl mt-2\"></i> <i class=\"batch-icon ${ evaluation.rating >= 2 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl\"></i> <i class=\"batch-icon ${ evaluation.rating >= 3 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl\"></i> <i class=\"batch-icon ${ evaluation.rating >= 4 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl\"></i> <i class=\"batch-icon ${ evaluation.rating >= 5 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-xxl mb-2\"></i></div></div><div class=\"col-md-12 mt-3\"><div class=\"form-group mx-auto\"><label class=\"control-label\">Comentários</label> <textarea class=\"form-control disabled\" disabled=\"disabled\" value.bind=\"evaluation.comment\" rows=\"2\"></textarea></div></div></div><div class=\"row float-right\"><button type=\"button\" class=\"btn btn-secondary waves-effect waves-light ml-2\" click.trigger=\"evaluation = null\" if.bind=\"! evaluation.processing\"><i class=\"fa fa-undo mr-2\"></i>Cancelar</button> <button type=\"button\" class=\"btn btn-danger waves-effect waves-light ml-2\" click.trigger=\"reject(evaluation)\" if.bind=\"! evaluation.processing && (evaluation.status == 0 || evaluation.status == 1)\"><i class=\"fa fa-times mr-2\" aria-hidden=\"true\"></i> Rejeitar</button> <button type=\"button\" class=\"btn btn-success waves-effect waves-light ml-2\" click.trigger=\"approve(evaluation)\" if.bind=\"! evaluation.processing  && (evaluation.status == 0 || evaluation.status == 2  || evaluation.status == 3)\"><i class=\"fa fa-check mr-2\"></i>Aprovar</button><div class=\"fa-2x text-center mx-auto\" if.bind=\"evaluation.processing\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></div></div></template>"; });
define('text!views/admin/supplier/editSupplier.html', ['module'], function(module) { module.exports = "<template><require from=\"../../components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"../../components/valueConverters/cellPhoneWithDDDValueConverter\"></require><require from=\"../../components/valueConverters/cnpjValueConverter\"></require><require from=\"../../components/valueConverters/cepValueConverter\"></require><require from=\"../../components/valueConverters/inscricaoEstadualValueConverter\"></require><require from=\"../../components/attributes/cnpjMask\"></require><require from=\"../../components/attributes/cepMask\"></require><require from=\"../../components/attributes/inscricaoEstadualMask\"></require><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Edição de fornecedor</div><div class=\"card-body\"><h4>Dados básicos</h4><div class=\"row mt-4\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Razão Social<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.name\" disabled.bind=\"! edit\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome Fantasia<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.fantasyName\" disabled.bind=\"! edit\"></div></div></div><div class=\"row mt-4\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">CNPJ<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.cnpj | cnpj  \" cnpj disabled.bind=\"! edit\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Inscrição Estadual<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" inscricaoestadual value.bind=\"supplier.inscricaoEstadual | inscricaoEstadual\" disabled.bind=\"! edit\"></div></div></div><h4 class=\"mt-4\">Endereço</h4><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">CEP</label> <input type=\"text\" class=\"form-control\" cep value.bind=\"supplier.address.cep | cep\" change.delegate=\"consultaCEP()\" disabled.bind=\"! edit\"></div></div></div><div class=\"row mt-4\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Logradouro</label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.address.logradouro\" disabled.bind=\"! edit\"></div><div class=\"form-group\"><label class=\"control-label\">Bairro</label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.address.neighborhood\" disabled.bind=\"! edit\"></div><div class=\"form-group\"><label class=\"control-label\">Estado</label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.address.state\" disabled.bind=\"! edit\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Número</label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.address.number\" disabled.bind=\"! edit\"></div><div class=\"form-group\"><label class=\"control-label\">Complemento</label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.address.complement\" disabled.bind=\"! edit\"></div><div class=\"form-group\"><label class=\"control-label\">Cidade</label> <input type=\"text\" class=\"form-control\" value.bind=\"supplier.address.city\" disabled.bind=\"! edit\"></div></div></div><h4 class=\"mt-4\">Contato</h4><div class=\"tab-pane\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isNameInvalid  ? 'border-danger' : '' }\" value.bind=\"supplier.contact.name\" change.delegate=\"validator.contactValidator.validateName()\" disabled.bind=\"! edit\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Comercial</label> <input type=\"text\" class=\"form-control\" phone-with-ddd value.bind=\"supplier.contact.commercialPhone | phoneWithDDD\" placeholder=\"(01) 1234-5678\"></div><div class=\"form-group\"><label class=\"control-label\">E-mail</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isEmailInvalid  ? 'border-danger' : '' } \" value.bind=\"supplier.contact.email\" change.delegate=\"validator.contactValidator.validateEmail()\" disabled.bind=\"! edit\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Telefone</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isPhoneInvalid  ? 'border-danger' : '' } \" phone-with-ddd value.bind=\"supplier.contact.phone | phoneWithDDD\" change.delegate=\"validator.contactValidator.validatePhone()\" disabled.bind=\"! edit\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Celular</label> <input type=\"text\" class=\"form-control\" cell-phone-with-ddd value.bind=\"supplier.contact.personalPhone | cellPhoneWithDDD\" placeholder=\"(01) 01234-5678\" disabled.bind=\"! edit\"></div></div></div></div><h4 class=\"mt-4\">Contrato Social</h4><div class=\"tab-pane\" id=\"tab3\"><div class=\"row\"><div class=\"col-md-6\" if.bind=\"selectedFiles == null || selectedFiles.length == 0\"><div class=\"form-group\"><button type=\"button\" class=\"btn btn-primary waves-effect waves-light col-md-6\" click.trigger=\"downloadSocialContract()\"><i class=\"batch-icon batch-icon-cloud-download\"></i> Download</button></div></div><div class=\"col-md-6\"><div class=\"form-group\"><form submit.delegate=\"uploadSocialContract()\" if.bind=\"edit\"><button type=\"submit\" if.bind=\"selectedFiles.length > 0\" class=\"btn ${ ! isUploading ? 'btn-primary' : 'btn-warning'} waves-effect waves-light col-md-6\" disable.bind=\"isUploading\"><span if.bind=\"! isUploading\"><i class=\"batch-icon batch-icon-cloud-upload\"></i> Upload </span><span if.bind=\"isUploading\"><i class=\"fa fa-circle-o-notch fa-spin\"></i> Processando arquivo</span></button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light\" if.bind=\"selectedFiles != null && selectedFiles.length > 0\" click.trigger=\"cancelUpload()\">Cancelar</button> <input id=\"files\" type=\"file\" accept=\".pdf\" files.bind=\"selectedFiles\" class=\"${ isUploading || (selectedFiles != null && selectedFiles.length > 0) ? 'invisible' : ''} mt-4\"></form></div></div></div></div><h4 class=\"mt-4\" if.bind=\"edit\">Usuários</h4><span class=\"badge badge-warning mt-2 mb-2\" if.bind=\"supplier.status != 0 && edit\">Para poder criar usuários faça a ativação do cadastro</span><div class=\"tab-pane\" if.bind=\"supplier.status != 2 && edit\"><div class=\"row\"><table class=\"table table-hover\"><thead><tr><th>Nome</th><th>E-mail</th><th>Status</th><th></th></tr></thead><tbody><tr repeat.for=\"x of users\"><td><span if.bind=\"! x.isEditing\">${x.name}</span><input type=\"text\" class=\"form-control col-md-8\" if.bind=\"x.isEditing\" value.bind=\"x.name\"></td><td><span if.bind=\"! x.isEditing\">${x.email}</span><input type=\"text\" class=\"form-control col-md-8\" if.bind=\"x.isEditing\" value.bind=\"x.email\"></td><td><span class=\"badge badge-success\" if.bind=\"x.status == 0\">Ativo</span> <span class=\"badge badge-danger\" if.bind=\"x.status == 1\">Inativo</span> <span class=\"badge badge-warning\" if.bind=\"x.status == 2\">Aguardando confirmação</span></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" if.bind=\"x.isEditing && supplier.status == 0\" click.trigger=\"saveEditUser(x)\">Salvar</button> <button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" if.bind=\"! x.isEditing  && supplier.status == 0\" click.trigger=\"editUser(x)\">Editar</button> <button type=\"button\" class=\"btn btn-secondary btn-sm waves-effect waves-light\" if.bind=\"  x.isEditing  && supplier.status == 0\" click.trigger=\"cancelEditUser(x)\">Cancelar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status == 0 && ! x.isEditing && supplier.status == 0\" click.trigger=\"editUserStatus(x, 1)\">Inativar</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" if.bind=\"x.status == 1 && ! x.isEditing  && supplier.status == 0\" click.trigger=\"editUserStatus(x, 0)\">Ativar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status == 2  && !    x.isEditing  && supplier.status == 0\" click.trigger=\"resendInvite(x)\">Reenviar convite</button></td></tr><tr if.bind=\"supplier.status == 0\"><td><input type=\"text\" class=\"form-control col-md-8\" value.bind=\"user.name\"></td><td><input type=\"text\" class=\"form-control col-md-8\" value.bind=\"user.email\"></td><td></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"createUser()\">Criar</button></td></tr></tbody></table></div></div></div><div class=\"row mt-5 mb-5 mx-auto\" if.bind=\"edit\"><button type=\"button\" class=\"btn btn-primary btn-gradient waves-effect waves-light\" click.trigger=\"save()\"><span class=\"gradient\">Salvar</span></button> <button type=\"button\" class=\"btn btn-success ml-2 waves-effect waves-light\" if.bind=\"supplier.status != 0\" click.trigger=\"editStatus(0)\">Ativar</button> <button type=\"button\" class=\"btn btn-danger ml-2 waves-effect waves-light\" if.bind=\"supplier.status == 0\" click.trigger=\"editStatus(1)\">Inativar</button> <button type=\"button\" class=\"btn btn-secondary ml-2 waves-effect waves-light\" click.trigger=\"cancel()\">Cancelar</button></div><div class=\"row mt-5 mb-5 mx-auto\" if.bind=\"! edit\"><button type=\"button\" class=\"btn btn-secondary ml-2 waves-effect waves-light\" click.trigger=\"cancelView()\">Cancelar</button></div></div></div></div></template>"; });
define('text!views/admin/supplier/listSuppliers.html', ['module'], function(module) { module.exports = "<template><require from=\"../../components/valueConverters/phoneWithDDDValueConverter\"></require><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Fornecedores</div><div class=\"card-body\"><div if.bind=\"! isEditing\"><div class=\"row mt-2\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Filtro</label> <input type=\"text\" class=\"form-control\" value.bind=\"filter\" placeholder=\"Pesquise por Nome/ Contato\" change.trigger=\"search()\"></div></div><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Status</label> <select class=\"form-control\" value.bind=\"selectedStatus\" change.delegate=\"search()\"><option value=\"\"></option><option value=\"0\">Ativos</option><option value=\"1\">Inativos</option><option value=\"2\">Aguardando liberação</option></select></div></div></div><table class=\"table table-hover\"><thead><tr><th>Nome</th><th>Contato</th><th>E-mail</th><th>Telefone</th><th>Status</th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredSuppliers\"><td>${x.name}</td><td>${x.contact.name}</td><td>${x.contact.email}</td><td>${x.contact.phone  | phoneWithDDD }</td><td><span class=\"badge badge-success\" if.bind=\"x.status == 0\">Ativo</span> <span class=\"badge badge-danger\" if.bind=\"x.status == 1\">Inativo</span> <span class=\"badge badge-warning\" if.bind=\"x.status == 2\">Aguardando liberação</span></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"edit(x)\">Editar</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" if.bind=\"x.status != 0\" click.trigger=\"editStatus(x, 0)\">Ativar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status == 0\" click.trigger=\"editStatus(x, 1)\">Inativar</button></td></tr></tbody></table></div></div></div></div></div></template>"; });
define('text!views/admin/product/listMarkets.html', ['module'], function(module) { module.exports = "<template><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Mercados</div><div class=\"card-body\"><div if.bind=\"! isEditing\"><div class=\"row mt-2 ml-2\"><button type=\"button\" class=\"btn btn-primary waves-effect waves-light\" click.trigger=\"create()\">Novo mercado</button></div><div class=\"row text-center mt-4 fa-2x\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div><table class=\"table table-hover\" if.bind=\"! isLoading\"><thead><tr><th>Nome</th><th>Status</th><th>Categorias</th><th></th></tr></thead><tbody><tr repeat.for=\"x of classes\"><td>${x.name}</td><td><span class=\"badge badge-success\" if.bind=\"x.isActive\">Ativo</span> <span class=\"badge badge-danger\" if.bind=\"! x.isActive\">Inativo</span></td><td><span repeat.for=\"y of x.categories\" class=\"badge ${ y.isActive ? 'badge-success' :  'badge-danger' } ml-2\">${y.name}</span></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"edit(x)\">Editar</button></td></tr></tbody></table></div><div if.bind=\"isEditing\"><div class=\"row\"><div class=\"col-md-8\"><div class=\"form-group\"><label class=\"control-label\">Nome<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" value.bind=\"market.name & validate\"> <span class=\"badge badge-success\" if.bind=\"market.isActive\">Ativo</span> <span class=\"badge badge-danger\" if.bind=\"! market.isActive\">Inativo</span></div></div></div><h4 class=\"mt-4\" if.bind=\"edit\">Categorias</h4><button type=\"button\" class=\"btn btn-primary waves-effect waves-light\" click.trigger=\"createCategory()\">Criar categoria</button><div class=\"tab-pane\"><div class=\"row\"><table class=\"table table-hover\"><thead><tr><th>Nome</th><th>Status</th><th></th></tr></thead><tbody><tr repeat.for=\"x of market.categories\"><td><input type=\"text\" class=\"form-control col-md-8\" value.bind=\"x.name\"></td><td><span class=\"badge badge-success\" if.bind=\"x.isActive\">Ativo</span> <span class=\"badge badge-danger\" if.bind=\"! x.isActive\">Inativo</span></td><td><button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.isActive\" click.trigger=\"editCategoryStatus(x)\">Inativar</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" if.bind=\"! x.isActive\" click.trigger=\"editCategoryStatus(x)\">Ativar</button></td></tr></tbody></table></div></div><div class=\"text-center mt-4\" if.bind=\"! isLoading\"><button type=\"button\" class=\"btn btn-primary waves-effect waves-light\" click.trigger=\"addOrUpdate()\">Salvar</button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light\" click.trigger=\"cancel()\">Cancelar</button> <button type=\"button\" class=\"btn btn-danger waves-effect waves-light\" if.bind=\"market.isActive\" click.trigger=\"editMarketStatus()\">Inativar</button> <button type=\"button\" class=\"btn btn-success waves-effect waves-light\" if.bind=\"! market.isActive\" click.trigger=\"editMarketStatus()\">Ativar</button></div><div class=\"text-center mt-4 fa-2x\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></div></template>"; });
define('text!views/admin/product/listProduct.html', ['module'], function(module) { module.exports = "<template><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Produtos</div><div class=\"card-body\"><div if.bind=\"! isEditing\"><div class=\"row mt-2\"><div class=\"col-lg-4\"><div class=\"form-group\" change.delegate=\"updateCategories()\"><label class=\"control-label\">Mercado</label> <select class=\"form-control\" value.bind=\"selectedClass\"><option repeat.for=\"class of classes\" model.bind=\"class\">${class.name}</option></select></div></div><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Categoria</label> <select class=\"form-control\" value.bind=\"selectedCategory\" change.delegate=\"searchProducts()\"><option repeat.for=\"category of selectedClass.categories\" model.bind=\"category\">${category.name}</option></select></div></div><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Filtro</label> <input type=\"text\" class=\"form-control\" value.bind=\"filter\" placeholder=\"Pesquise por Produto / Descrição\" change.trigger=\"search()\"></div></div></div><div class=\"row mt-2 ml-2\"><button type=\"button\" class=\"btn btn-primary waves-effect waves-light\" click.trigger=\"create()\">Novo produto</button></div><div class=\"row text-center mt-4 fa-2x\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div><table class=\"table table-hover\" if.bind=\"! isLoading\"><thead><tr><th>Nome</th><th>Descrição</th><th>Marca</th><th>Categoria</th><th>UM</th><th>Status</th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredProducts\"><td>${x.name}</td><td>${x.description}</td><td>${x.brand.name}</td><td>${x.category.name}</td><td>${x.unit.name}</td><td><span class=\"badge badge-success\" if.bind=\"x.isActive\">Ativo</span> <span class=\"badge badge-danger\" if.bind=\"! x.isActive\">Inativo</span></td><td><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"edit(x)\">Editar</button></td></tr></tbody></table></div><div if.bind=\"isEditing\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" value.bind=\"product.name & validate\"></div></div></div><div class=\"row mt-4\"><div class=\"col-md-8\"><div class=\"form-group\"><label class=\"control-label\">Descrição<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" value.bind=\"product.description\"></div></div></div><div class=\"row mt-4\"><div class=\"col-md-4\"><div class=\"form-group\"><label class=\"control-label\">Mercado</label> <select class=\"form-control\" value.bind=\"selectedClassProduct\"><option repeat.for=\"class of classes\" model.bind=\"class\">${class.name}</option></select></div></div><div class=\"col-md-4\"><div class=\"form-group\"><label class=\"control-label\">Categoria</label> <select class=\"form-control\" value.bind=\"product.category & validate\"><option value=\"\"></option><option repeat.for=\"category of selectedClassProduct.categories\" model.bind=\"category\">${category.name}</option></select></div></div></div><div class=\"row mt-4\"><div class=\"col-md-4\"><div class=\"form-group\"><label class=\"control-label\">Marca</label> <select class=\"form-control\" value.bind=\"selectedCategory\"><option value=\"\"></option></select></div></div><div class=\"col-md-4\"><div class=\"form-group\"><label class=\"control-label\">UM<span class=\"text-danger ml-1 bold\">*</span></label> <select class=\"form-control\" value.bind=\"product.unit\"><option value=\"\"></option><option repeat.for=\"unit of units\" model.bind=\"unit\">${unit.name}</option></select></div></div><div class=\"col-md-4\"><div class=\"col-md-4\"></div><label class=\"control-label mt-5\">Ativo<span class=\"text-danger ml-1 bold\">*</span></label> <label class=\"form-check-label ml-2 float-left mt-5\"><input class=\"form-check-input float-left\" type=\"checkbox\" checked.bind=\"product.isActive\"></label></div></div><div class=\"text-center mt-4\" if.bind=\"! isLoading\"><button type=\"button\" class=\"btn btn-primary waves-effect waves-light\" click.trigger=\"addOrUpdate()\">Salvar</button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light\" click.trigger=\"cancel()\">Cancelar</button></div><div class=\"text-center mt-4 fa-2x\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></div></template>"; });
define('text!views/admin/finance/listInvoice.html', ['module'], function(module) { module.exports = "<template><require from=\"../../components/attributes/moneyMask\"></require><require from=\"../../components/valueConverters/moneyValueConverter\"></require><require from=\"../../components/valueConverters/dateFormatValueConverter\"></require><require from=\"../../components/valueConverters/phoneWithDDDValueConverter\"></require><require from=\"../../components/valueConverters/cellPhoneWithDDDValueConverter\"></require><require from=\"../../components/valueConverters/cnpjValueConverter\"></require><require from=\"../../components/valueConverters/cepValueConverter\"></require><require from=\"../../components/valueConverters/inscricaoEstadualValueConverter\"></require><require from=\"../../components/attributes/cnpjMask\"></require><require from=\"../../components/attributes/cepMask\"></require><require from=\"../../components/attributes/inscricaoEstadualMask\"></require><require from=\"../../components/attributes/timeMask\"></require><require from=\"../../components/valueConverters/timeValueConverter\"></require><div class=\"row mb-5 task-manager au-animate\"><div class=\"col-lg-12\"><div class=\"card\"><div class=\"card-header\">Faturas</div><div class=\"card-body\"><div if.bind=\"! isEditing\"><div class=\"row mt-2\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Data de referência</label> <select class=\"form-control\" value.bind=\"selectedControl\" change.delegate=\"changeControl()\"><option repeat.for=\"control of controls\" model.bind=\"control\">${control.dateLabel}</option></select></div></div><div class=\"col-lg-4 mt-4\" if.bind=\"selectedControl.canGenerateInvoices\"><button type=\"button\" if.bind=\"! isLoading\" class=\"btn btn-primary waves-effect waves-light\" click.trigger=\"generateInvoices()\">Gerar Faturamento</button><div class=\"fa-2x\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div><div class=\"row mt-2\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Valor a receber</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" value.bind=\"totalValue | money\" money></div></div><div class=\"col-lg-4\"><label class=\"control-label\">Valor recebido</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" value.bind=\"totalValuePaid | money\" money></div></div><div class=\"row mt-2\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Filtro</label> <input type=\"text\" class=\"form-control\" value.bind=\"filter\" placeholder=\"Pesquise por Nome/ Contato\" change.trigger=\"search()\"></div></div><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Status</label> <select class=\"form-control\" value.bind=\"selectedStatus\" change.delegate=\"search()\"><option value=\"\"></option><option value=\"0\">Gerado</option><option value=\"1\">Pago</option><option value=\"2\">Inadimplente</option></select></div></div></div><table class=\"table table-hover\"><thead><tr><th>Fornecedor</th><th>Vencimento</th><th class=\"text-center\">Qtde de Pedidos</th><th class=\"text-center\">Total dos Pedidos</th><th class=\"text-center\">Valor da Fatura</th><th>Status</th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredInvoices\"><td>${x.supplier.name}</td><td>${x.maturity | dateFormat}</td><td class=\"text-center\">${x.orders.length}</td><td class=\"text-center\">${x.totalValue | money}</td><td class=\"text-center\">${x.valueToPay | money}</td><td><span class=\"badge badge-primary\" if.bind=\"x.status == 0\">Gerado</span> <span class=\"badge badge-success\" if.bind=\"x.status == 1\">Pago</span> <span class=\"badge badge-danger\" if.bind=\"x.status == 2\">Inadimplente</span></td><td if.bind=\"! x.isEditing\"><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"edit(x)\">Detalhes</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" if.bind=\"x.status != 1\" click.trigger=\"editStatus(x, 1)\">Efetuar baixa</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light\" if.bind=\"x.status != 2\" click.trigger=\"editStatus(x, 2)\">Pendenciar</button></td><td if.bind=\"x.isEditing\"><div class=\"fa-3x mx-auto\" if.bind=\"isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></td></tr></tbody></table></div><div if.bind=\"isEditing\"><h4>Dados do fornecedor</h4><div class=\"row mt-4\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Razão Social</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" value.bind=\"selectedInvoice.supplier.name\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome Fantasia<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" value.bind=\"selectedInvoice.supplier.fantasyName\"></div></div></div><div class=\"row mt-4\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">CNPJ</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" value.bind=\"selectedInvoice.supplier.cnpj | cnpj\" cnpj></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Inscrição Estadual</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" inscricaoestadual value.bind=\"selectedInvoice.supplier.inscricaoEstadual | inscricaoEstadual\"></div></div></div><h4 class=\"mt-4\">Contato</h4><div class=\"tab-pane\"><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Nome</label> <input type=\"text\" class=\"form-control ${validator.contactValidator.isNameInvalid  ? 'border-danger' : '' }\" disabled.bind=\"! edit\" value.bind=\"selectedInvoice.supplier.contact.name\" change.delegate=\"validator.contactValidator.validateName()\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Comercial</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" phone-with-ddd value.bind=\"selectedInvoice.supplier.contact.commercialPhone | phoneWithDDD\" disabled.bind=\"! edit\" placeholder=\"(01) 1234-5678\"></div><div class=\"form-group\"><label class=\"control-label\">E-mail</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" value.bind=\"selectedInvoice.supplier.contact.email\" change.delegate=\"validator.contactValidator.validateEmail()\"></div></div><div class=\"col-md-6\"><div class=\"form-group\"><label class=\"control-label\">Telefone</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" phone-with-ddd value.bind=\"selectedInvoice.supplier.contact.phone | phoneWithDDD\" change.delegate=\"validator.contactValidator.validatePhone()\"></div><div class=\"form-group\"><label class=\"control-label\">Telefone Celular</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" cell-phone-with-ddd value.bind=\"selectedInvoice.supplier.contact.personalPhone | cellPhoneWithDDD\" disabled.bind=\"! edit\" placeholder=\"(01) 01234-5678\"></div></div></div></div><h4 class=\"mt-4\">Dados da Fatura</h4><div class=\"tab-pane\"><div class=\"row\"><div class=\"col-md-3\"><div class=\"form-group\"><label class=\"control-label\">Valor Total dos pedidos</label> <input type=\"text\" class=\"form-control\" value.bind=\"selectedInvoice.totalValue | money\" money change.delegate=\"calculateInvoicePrice()\"></div><div class=\"form-group\"><label class=\"control-label\">Data de vencimento</label> <input type=\"text\" class=\"form-control\" value.bind=\"selectedInvoice.maturity | dateFormat\" date></div></div><div class=\"col-md-3\"><div class=\"form-group\"><label class=\"control-label\">Percentual de cobrança (%)</label> <input type=\"text\" class=\"form-control\" value.bind=\"selectedInvoice.fee | money\" money change.delegate=\"calculateInvoicePrice()\"></div><div class=\"form-group\"><label class=\"control-label\">Gerado em</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" value.bind=\"selectedControl.createdOn | dateFormat\" date></div></div><div class=\"col-md-3\"><div class=\"form-group\"><label class=\"control-label\">Valor da fatura</label> <input type=\"text\" class=\"form-control disabled\" disabled.bind=\"true\" value.bind=\"selectedInvoice.valueToPay | money\" money></div></div><div class=\"col-md-3 mt-4\"><div class=\"form-group\"><button type=\"button\" class=\"btn btn-primary btn-sm btn-danger waves-effect waves-light\" click.trigger=\"cancelEditInvoicePrice()\"><span class=\"gradient\">Cancelar</span></button></div></div></div></div><h4 class=\"mt-4\">Pedidos</h4><div class=\"row mt-2\"><table class=\"table table-hover table-responsive\"><thead><tr><th class=\"text-center\">Código</th><th class=\"text-center\">Status</th><th class=\"text-center\">Data do Pedido</th><th class=\"text-center\">Food Service</th><th class=\"text-center\">Entrega</th><th class=\"text-center\">Quantidade de Produtos</th><th class=\"text-center\">Total</th></tr></thead><tbody><tr repeat.for=\"order of selectedInvoice.orders\"><td class=\"text-center\">${order.code}</td><td class=\"text-center\"><span class=\"badge badge-danger\" if.bind=\"order.status == 0\">Novo pedido</span> <span class=\"badge badge-warning\" if.bind=\"order.status == 1\">Aceito</span> <span class=\"badge badge-primary\" if.bind=\"order.status == 2\">Entregue</span> <span class=\"badge badge-default\" if.bind=\"order.status == 3\">Rejeitado</span></td><td class=\"text-center\">${order.createdOn | dateFormat}</td><td>${order.foodService.name}</td><td class=\"text-center\"><span if.bind=\"order.deliveryScheduleStart != null\">das ${order.deliveryScheduleStart | time} as ${order.deliveryScheduleEnd | time} </span></td><td class=\"text-center\">${order.items.length}</td><td class=\"text-center\">${order.total | money}</td></tr></tbody></table></div></div><div class=\"row mt-5 mb-5\"><div class=\"mx-auto\" if.bind=\"isEditing && ! isLoading\"><button type=\"button\" class=\"btn btn-primary btn-gradient waves-effect waves-light\" if.bind=\"edit\" click.trigger=\"saveInvoice()\"><span class=\"gradient\">Salvar</span></button> <button type=\"button\" class=\"btn btn-success waves-effect waves-light\" if.bind=\"selectedInvoice.status != 1\" click.trigger=\"editStatus(selectedInvoice, 1)\">Efetuar baixa</button> <button type=\"button\" class=\"btn btn-danger waves-effect waves-light\" if.bind=\"selectedInvoice.status != 2\" click.trigger=\"editStatus(selectedInvoice, 2)\">Pendenciar</button> <button type=\"button\" class=\"btn btn-secondary ml-2 waves-effect waves-light\" click.trigger=\"cancelEdit()\">Voltar</button></div><div class=\"fa-3x mx-auto\" if.bind=\"isEditing && isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></div></template>"; });
define('text!views/components/partials/listaDePrecos.html', ['module'], function(module) { module.exports = "<template><require from=\"../attributes/moneyMask\"></require><require from=\"../valueConverters/moneyValueConverter\"></require><div class=\"col-md-12\"><div id=\"accordion2\" role=\"tablist\" aria-multiselectable=\"true\"><div class=\"\" repeat.for=\"list of lists\"><div class=\"card-header ml-0\" role=\"tab\" id=\"headingFile${list.id}\"><h5 class=\"mb-0\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse${list.id}\" aria-expanded=\"false\" aria-controls=\"collapse${list.id}\" class=\"\"> ${dataAtualFormatada(list.date)} </a></h5></div><div id=\"collapse${list.id}\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\" style=\"\"><div class=\"card-body\"><table class=\"table table-hover\"><thead><tr><th>Nome</th><th>Descrição</th><th>Mercado</th><th>Categoria</th><th>UM</th><th>Marca</th><th class=\"text-center\">Preço</th></tr></thead><tbody><tr repeat.for=\"item of list.items\"><td>${item.product.product.name}</td><td>${item.product.product.description}</td><td>${item.product.product.category.productClass.name}</td><td>${item.product.product.category.name}</td><td>${item.product.product.unit.name}</td><td>${item.product.product.brand.name}</td><td class=\"text-center\">${item.price.toFixed(2)}</td></tr></tbody></table><button type=\"button\" class=\"btn btn-primary waves-effect waves-light col-md-2\" click.trigger=\"downloadList(list)\"><i class=\"batch-icon batch-icon-cloud-download\"></i> Baixar Lista</button></div></div></div></div></div></template>"; });
define('text!views/components/partials/baixaPedido.html', ['module'], function(module) { module.exports = "<template><require from=\"jquery-datetimepicker/jquery.datetimepicker.min.css\"></require><require from=\"../attributes/moneyMask\"></require><require from=\"../attributes/datepicker\"></require><require from=\"../valueConverters/dateFormatValueConverter\"></require><div class=\"row mb-5\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Baixa de Pedido</div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group text-center\"><label class=\"control-label\">Tem certeza que deseja efetuar a baixa o pedido <strong>nº ${order.code}</strong>?</label></div></div></div><div class=\"row mt-3\"><div class=\"col-md-12 mt-3\"><div class=\"form-group mx-auto text-center\"><p class=\"text-center\">Avalie a qualidade do fornecedor</p><i style=\"cursor:pointer\" class=\"batch-icon ${ notaAvaliacao >= 1 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg mt-2\" click.trigger=\"setAvaliacao(1)\"></i> <i style=\"cursor:pointer\" class=\"batch-icon ${ notaAvaliacao >= 2 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\" click.trigger=\"setAvaliacao(2)\"></i> <i style=\"cursor:pointer\" class=\"batch-icon ${ notaAvaliacao >= 3 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\" click.trigger=\"setAvaliacao(3)\"></i> <i style=\"cursor:pointer\" class=\"batch-icon ${ notaAvaliacao >= 4 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg\" click.trigger=\"setAvaliacao(4)\"></i> <i style=\"cursor:pointer\" class=\"batch-icon ${ notaAvaliacao >= 5 ? 'text-warning' : '' } batch-icon-star-alt batch-icon-lg mb-2\" click.trigger=\"setAvaliacao(5)\"></i></div></div><div class=\"col-md-12 mt-3\"><div class=\"form-group mx-auto\"><label class=\"control-label\">Comentários</label> <textarea class=\"form-control\" value.bind=\"evaluation.comment\" rows=\"2\"></textarea></div></div></div><div class=\"row mt-3\"><button type=\"button\" class=\"btn btn-success waves-effect waves-light mx-auto ml-5\" click.trigger=\"acceptOrder()\" if.bind=\"! processing\"><i class=\"fa fa-check mr-2\"></i>Confirmar</button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light mx-auto ml-5 mr-5\" click.trigger=\"cancel()\" if.bind=\"! processing\"><i class=\"fa fa-undo mr-2\"></i>Cancelar</button><div class=\"fa-2x text-center mx-auto\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></div></template>"; });
define('text!views/components/partials/cotacaoPedido.html', ['module'], function(module) { module.exports = "<template><div class=\"card-body\"><h4 class=\"mt-5\">Dados do pedido</h4><div class=\"col-md-12 card-table table-responsive\"><table class=\"table table-hover table-sm align-middle\"><thead><tr><th class=\"text-center\">Nome do Produto</th><th class=\"text-right\">Preço unitário</th><th class=\"text-right\">Quantidade</th><th class=\"text-right\">Total</th></tr></thead><tbody><tr><td> ${item.product.name} <div><small class=\"boldness-light\">${item.supplier.name}</small></div></td><td class=\"text-right\"> ${item.price | money} </td><td class=\"text-right\"> ${item.quantity} </td><td class=\"text-right\"> ${item.total  | money} </td></tr><tr><td colspan=\"3\" class=\"text-right\"><strong>Total:</strong></td><td class=\"text-right\"><strong>${result.total  | money}</strong></td></tr></tbody></table></div><h4>Sumário</h4><div class=\"col-md-12 card-table table-responsive\"><table class=\"table table-hover table-sm align-middle\"><thead><tr><th class=\"text-left\">Fornecedor</th><th class=\"text-center\">Avaliação</th><th class=\"text-center\">Qtde de dias para aceite</th><th class=\"text-center\">Período de Aceite</th><th class=\"text-center\">Dias de entrega</th><th class=\"text-center\">Período de Entrega</th><th class=\"text-right\">Total</th></tr></thead><tbody><tr repeat.for=\"item of result.summaryItems\"><td> ${item.supplier.name} </td><td class=\"text-center\"><i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i> <i aria-hidden=\"true\" class=\"fa fa-star\" style=\"color:#ff0;-webkit-text-stroke-width:1px;-webkit-text-stroke-color:orange\"></i></td><td class=\"text-center\"> ${item.rule.numberOfDaysToAccept} dias</td><td class=\"text-center\"> ${item.rule.periodToAcceptOrder1 | time} <label class=\"mr-sm-2 ml-2\" for=\"inlineFormCustomSelect\">as</label> ${item.rule.periodToAcceptOrder2 | time} </td><td><span if.bind=\"item.rule.deliveryOnMonday\" class=\"badge ${ item.rule.deliveryOnMonday ? 'badge-success' : 'badge-warning' }\">Segunda-feira</span> <span if.bind=\"item.rule.deliveryOnTuesday\" class=\"badge ${ item.rule.deliveryOnTuesday ? 'badge-success' : 'badge-warning' }\">Terça-feira</span> <span if.bind=\"item.rule.deliveryOnWednesday\" class=\"badge ${ item.rule.deliveryOnWednesday ? 'badge-success' : 'badge-warning' }\">Quarta-feira</span> <span if.bind=\"item.rule.deliveryOnThursday\" class=\"badge ${ item.rule.deliveryOnThursday ? 'badge-success' : 'badge-warning' }\">Quinta-feira</span> <span if.bind=\"item.rule.deliveryOnFriday\" class=\"badge ${ item.rule.deliveryOnFriday ? 'badge-success' : 'badge-warning' }\">Sexta-feira</span><br><br><span if.bind=\"item.rule.deliveryOnSaturday\" class=\"badge ${ item.rule.deliveryOnSaturday ? 'badge-success' : 'badge-warning' }\">Sábado</span> <span if.bind=\"item.rule.deliveryOnSunday\" class=\"badge ${ item.rule.deliveryOnSunday ? 'badge-success' : 'badge-warning' }\">Domingo</span></td><td class=\"text-center\"> ${item.rule.deliverySchedule1 | time} <label class=\"mr-sm-2 ml-2\" for=\"inlineFormCustomSelect\">as</label> ${item.rule.deliverySchedule2 | time} </td><td class=\"text-right\"> ${item.total  | money} </td></tr></tbody></table></div></div></template>"; });
define('text!views/components/partials/observacoesPedido.html', ['module'], function(module) { module.exports = "<template><require from=\"jquery-datetimepicker/jquery.datetimepicker.min.css\"></require><require from=\"../attributes/moneyMask\"></require><require from=\"../attributes/timeMask\"></require><require from=\"../attributes/datepicker\"></require><require from=\"../valueConverters/dateFormatValueConverter\"></require><require from=\"../valueConverters/timeValueConverter\"></require><div class=\"row mb-5\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Observação pedido</div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"control-label\">Deseja acrescentar alguma observação ao pedido?</label></div></div></div><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group mx-auto\"><textarea class=\"form-control disabled\" disabled=\"disabled\" value.bind=\"selectedQuote.observation\" rows=\"2\"></textarea></div></div></div></div><div class=\"row mb-4\"><div class=\"fa-2x text-center mx-auto\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div><button type=\"button\" class=\"btn btn-success waves-effect waves-light mx-auto ml-5\" click.trigger=\"confirmOrder()\"><i class=\"fa fa-check mr-2\"></i>Confirmar</button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light mx-auto ml-5 mr-5\" click.trigger=\"cancel()\"><i class=\"fa fa-undo mr-2\"></i>Cancelar</button></div></div></div></div></template>"; });
define('text!views/components/partials/produtosSelecionados.html', ['module'], function(module) { module.exports = "<template><div class=\"row mt-4\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Mercado</label> <select class=\"form-control\" value.bind=\"selectedClass\" change.delegate=\"updateCategories()\"><option repeat.for=\"class of classes\" model.bind=\"class\">${class.name}</option></select></div></div><div class=\"col-lg-4\" if.bind=\"selectedClass != null\"><div class=\"form-group\"><label class=\"control-label\">Categoria</label> <select class=\"form-control\" value.bind=\"selectedCategory\" change.delegate=\"search()\"><option repeat.for=\"category of selectedClass.categories\" model.bind=\"category\">${category.name}</option></select></div></div><div class=\"col-lg-4\" if.bind=\"selectedClass != null\"><div class=\"form-group\"><label class=\"control-label\">Filtro</label> <input type=\"text\" class=\"form-control\" value.bind=\"filter\" placeholder=\"Pesquise por Produto / Descrição\" change.trigger=\"search()\"></div></div></div><div class=\"row\" if.bind=\"selectedClass != null\"><div class=\"col-lg-4\"><div class=\"form-group\"><button type=\"button\" if.bind=\"! isCreatingList\" class=\"btn btn-primary btn-sm waves-effect waves-light au-target au-target\" click.trigger=\"isCreatingList = true\">Criar Lista</button> <input type=\"text\" if.bind=\"  isCreatingList\" class=\"form-control\" value.bind=\"newListName\" placeholder=\"Digite o nome da lista\"></div></div><div class=\"col-lg-4\" if.bind=\"isCreatingList\"><div class=\"form-group\"><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light au-target au-target\" click.trigger=\"createList()\">Salvar</button> <button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light au-target au-target\" click.trigger=\"isCreatingList = false\">Cancelar</button></div></div></div><div class=\"row\" if.bind=\"isFiltered\"><div class=\"col-md-12 pb-5\"><table class=\"table table-hover\"><thead><tr><th>Nome</th><th class=\"text-center\">Descrição</th><th>Categoria</th><th>UM</th><th>Marca</th><th repeat.for=\"list of lists\" class=\"ml-2 text-center\" if.bind=\"list.status == 0\"> ${list.name} <br><button type=\"button\" if.bind=\"! x.isLoading\" class=\"btn btn-danger btn-sm waves-effect waves-light\" click.trigger=\"deleteList(list)\"><i class=\"fa fa-times mr-2\" style=\"cursor:pointer\"></i> Apagar</button></th><th></th></tr></thead><tbody><tr repeat.for=\"x of filteredProducts\"><td> ${x.product.name} <span if.bind=\"x.isNew\" class=\"badge badge-warning\">Novo!</span></td><td class=\"text-center\">${x.product.description}</td><td>${x.product.category.name}</td><td>${x.product.unit.name}</td><td></td><td repeat.for=\"list of lists\" if.bind=\"list.status == 0\" class=\"text-center\"><label class=\"custom-control custom-checkbox\"><input type=\"checkbox\" class=\"custom-control-input\" checked.bind=\"list[x.product.name + '_'+ x.product.unit.name + '_' + x.product.description]\" change.trigger=\"changeList(list, x)\"> <span class=\"custom-control-indicator\"></span></label></td><td><button type=\"button\" if.bind=\"! x.isLoading\" class=\"btn btn-danger btn-sm waves-effect waves-light ${ isProcessing ? 'disable' : ''  && ! product.isLoading }\" disabled.bind=\"isProcessing\" click.trigger=\"removeProduct(x)\">Remover</button><div class=\"fa-2x\" if.bind=\"x.isLoading  == true\"><i class=\"fa fa-refresh fa-spin\"></i></div></td></tr></tbody></table></div></div></template>"; });
define('text!views/components/partials/selecaoDeProdutosFoodService.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Mercado</label> <select class=\"form-control\" value.bind=\"selectedClass\" change.delegate=\"updateCategory()\"><option repeat.for=\"class of classes\" model.bind=\"class\">${class.name}</option></select></div></div><div class=\"col-lg-4\" if.bind=\"selectedClass != null\"><div class=\"form-group\"><label class=\"control-label\">Categoria</label> <select class=\"form-control\" value.bind=\"selectedCategory\" change.delegate=\"search()\"><option repeat.for=\"category of selectedClass.categories\" model.bind=\"category\">${category.name}</option></select></div></div><div class=\"col-lg-4\" if.bind=\"selectedClass != null\"><div class=\"form-group\"><label class=\"control-label\">Filtro</label> <input type=\"text\" class=\"form-control\" value.bind=\"filter\" placeholder=\"Pesquise por Produto / Descrição\" change.trigger=\"search()\"></div></div></div><div class=\"row\" if.bind=\"isFiltered\"><div class=\"col-md-12 pb-5\"><table class=\"table table-hover\"><thead><tr><th>Nome</th><th class=\"text-center align-middle\">Descrição</th><th>Categoria</th><th>UM</th><th></th></tr></thead><tbody><tr repeat.for=\"product of filteredProducts\"><td>${product.name}</td><td class=\"text-center align-middle\">${product.description}</td><td>${product.category.name}</td><td>${product.unit.name}</td><td><button if.bind=\"! product.isLoading\" type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light ${ isProcessing ? 'disable' : ''  && ! product.isLoading }\" disabled.bind=\"isProcessing\" click.trigger=\"addProduct(product)\">Incluir</button><div class=\"fa-2x\" if.bind=\"product.isLoading  == true\"><i class=\"fa fa-refresh fa-spin\"></i></div></td></tr></tbody></table></div></div></template>"; });
define('text!views/components/partials/rejeicaoPedido.html', ['module'], function(module) { module.exports = "<template><require from=\"jquery-datetimepicker/jquery.datetimepicker.min.css\"></require><require from=\"../attributes/moneyMask\"></require><require from=\"../attributes/datepicker\"></require><require from=\"../valueConverters/dateFormatValueConverter\"></require><div class=\"row mb-5\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Rejeição de Pedido</div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><h5 class=\"control-label\">Tem certeza que deseja rejeitar o pedido <strong>nº ${order.code}</strong>?</h5></div></div></div><div class=\"row\"><div class=\"col-md-12 mt-3\"><div class=\"form-group\"><label class=\"control-label\">Informe o motivo da rejeição</label> <textarea class=\"form-control\" value.bind=\"vm.reason & validate\" rows=\"3\"></textarea><h6 class=\"text-center mt-2 font-bold\"><strong>Ao rejeitar pedidos sua avaliação pode ser penalizada</strong></h6></div></div></div></div><div class=\"row mb-4\"><div class=\"fa-2x text-center mx-auto\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div><button type=\"button\" class=\"btn btn-danger waves-effect waves-light mx-auto ml-5\" if.bind=\"! processing\" click.trigger=\"rejectOrder()\"><i class=\"fa fa-times mr-2\"></i>Rejeitar</button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light mx-auto ml-5 mr-5\" if.bind=\"! processing\" click.trigger=\"cancel()\"><i class=\"fa fa-undo mr-2\"></i>Cancelar</button><div class=\"fa-2x text-center mx-auto\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></template>"; });
define('text!views/components/partials/horarioDeEntregaPedido.html', ['module'], function(module) { module.exports = "<template><require from=\"jquery-datetimepicker/jquery.datetimepicker.min.css\"></require><require from=\"../attributes/moneyMask\"></require><require from=\"../attributes/timeMask\"></require><require from=\"../attributes/datepicker\"></require><require from=\"../valueConverters/dateFormatValueConverter\"></require><require from=\"../valueConverters/timeValueConverter\"></require><div class=\"row mb-5\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Horário de Entrega</div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"control-label\">As informações abaixo são definidas com base nas regras de entrega cadastradas</label></div></div></div><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><h5 class=\"control-label\">Confirme a data de entrega desejada do pedido</h5></div></div></div><div class=\"row\"><div class=\"col-md-12 mt-3\"><div class=\"form-group\"><input type=\"text\" class=\"form-control text-right\" autocomplete=\"off\" placeholder=\"00/00/0000\" value.bind=\"vm.deliveryDate | dateFormat & updateTrigger:'blur' & validate\" datepicker></div></div></div><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><h5 class=\"control-label\">Confirme o horário de entrega do pedido</h5></div></div></div><div class=\"row\"><div class=\"col-md-12 mt-3\"><div class=\"form-group\"><label class=\"control-label\">Horário inicial</label><div class=\"input-group\"><span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control\" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"vm.deliveryScheduleStart | time & updateTrigger:'blur' & validate\"></div></div></div></div><div class=\"row\"><div class=\"col-md-12 mt-3\"><div class=\"form-group\"><label class=\"control-label\">Horário final</label><div class=\"input-group\"><span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control\" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"vm.deliveryScheduleEnd | time & updateTrigger:'blur' & validate \"></div></div></div></div></div><div class=\"row mb-4\"><div class=\"fa-2x text-center mx-auto\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div><button type=\"button\" class=\"btn btn-success waves-effect waves-light mx-auto ml-5\" click.trigger=\"confirmSchedule()\"><i class=\"fa fa-check mr-2\"></i>Confirmar</button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light mx-auto ml-5 mr-5\" click.trigger=\"cancel()\"><i class=\"fa fa-undo mr-2\"></i>Cancelar</button><div class=\"fa-2x text-center mx-auto\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></template>"; });
define('text!views/components/partials/atualizacaoDePrecos.html', ['module'], function(module) { module.exports = "<template><require from=\"../attributes/moneyMask\"></require><require from=\"../valueConverters/moneyValueConverter\"></require><div class=\"col-md-12\"><div id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\"><div class=\"\"><div class=\"card-header ml-0\" role=\"tab\" id=\"headingTwo\"><h5 class=\"mb-0\"><a class=\"\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseTwo\" aria-expanded=\"false\" aria-controls=\"collapseTwo\">Produtos fornecidos</a></h5></div><div id=\"collapseTwo\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"headingTwo\" style=\"\"><div class=\"card-body\"><div class=\"row mt-2\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Mercado</label> <select class=\"form-control\" value.bind=\"selectedClass\" change.delegate=\"updateCategories()\"><option repeat.for=\"class of classes\" model.bind=\"class\">${class.name}</option></select></div></div><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Categoria</label> <select class=\"form-control\" value.bind=\"selectedCategory\" change.delegate=\"loadProducts()\"><option repeat.for=\"category of selectedClass.categories\" model.bind=\"category\">${category.name}</option></select></div></div><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Filtro</label> <input type=\"text\" class=\"form-control\" value.bind=\"filter\" placeholder=\"Pesquise por Produto / Descrição\" change.trigger=\"search()\"></div></div></div></div><table class=\"table table-hover mt-2\" if.bind=\"! isLoading\"><thead><tr><th>Nome</th><th>Descrição</th><th>Categoria</th><th>UM</th><th>Marca</th><th class=\"text-center\">Preço</th><th>Status</th><th></th></tr></thead><tbody><tr repeat.for=\"supplierProduct of filteredProducts\"><td> ${supplierProduct.product.name} <span if.bind=\"supplierProduct.isNew\" class=\"badge badge-warning\">Novo!</span></td><td>${supplierProduct.product.description}</td><td>${supplierProduct.product.category.name}</td><td>${supplierProduct.product.unit.name}</td><td></td><td><div class=\"col-md-12 mx-auto\"><input type=\"text\" class=\"money text-right form-control ${supplierProduct.isEditing ? '' : 'disabled' } \" disabled.bind=\"! supplierProduct.isEditing\" autocomplete=\"off\" value.bind=\"supplierProduct.price | money\" money placeholder=\"000,00\"></div></td><th><span class=\"badge badge-success ${supplierProduct.status == 0 && ! supplierProduct.isEditing ? 'float-left' :  'invisible' }\">Ativo</span> <span class=\"badge badge-danger ${supplierProduct.status == 1 && ! supplierProduct.isEditing ? 'float-left' :  'invisible' }\">Inativo</span><br><span class=\"badge badge-warning\" if.bind=\"supplierProduct.wasAltered\">Alterado</span></th><td><div class=\"fa-2x text-center mx-auto\" if.bind=\"supplierProduct.isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div><div class=\"col-md-12 mx-auto\"><button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light ${ ! supplierProduct.isEditing && ! isLoading  ? '' : 'invisible' } \" if.bind=\"! supplierProduct.isEditing && ! supplierProduct.isLoading \" click.trigger=\"edit(supplierProduct)\">Editar</button> <button type=\"button\" class=\"btn btn-danger btn-sm waves-effect waves-light ${supplierProduct.status == 0 && supplierProduct.isEditing ? ' float-left' : 'invisible' } \" if.bind=\"supplierProduct.status != 1\" click.trigger=\"alterStatus(supplierProduct, 1)\">Inativar</button> <button type=\"button\" class=\"btn btn-warning btn-sm waves-effect waves-light ${ supplierProduct.isEditing && ! isLoading  ? '' : 'invisible' } \" if.bind=\"supplierProduct.status != 2\" click.trigger=\"alterStatus(supplierProduct, 2)\">Remover</button> <button type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light ${supplierProduct.status == 1 && supplierProduct.isEditing ? 'float-left' :  'invisible'  } \" if.bind=\"supplierProduct.status != 0\" click.trigger=\"alterStatus(supplierProduct, 0) \">Ativar</button> <button type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light ${ supplierProduct.isEditing && ! isLoading  ? '' : 'invisible' } \" if.bind=\"supplierProduct.isEditing\" click.trigger=\"save(supplierProduct)\">Salvar</button> <button type=\"button\" class=\"btn btn-secondary btn-sm waves-effect waves-light ${ supplierProduct.isEditing && ! isLoading ? '' : 'invisible' } \" if.bind=\"supplierProduct.isEditing\" click.trigger=\"cancelEdit(supplierProduct)\">Cancelar</button></div></td></tr></tbody></table></div></div></div><div class=\"\"><div class=\"card-header ml-0\" role=\"tab\" id=\"headingThree\"><h5 class=\"mb-0\"><a class=\"\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseThree\" aria-expanded=\"false\" aria-controls=\"collapseThree\">Download</a></h5></div><div id=\"collapseThree\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"headingThree\" style=\"\"><div class=\"card-body\"><p class=\"text-left\">Atualize o preço para os seus produtos através do download e upload de planilha</p><button type=\"button\" class=\"btn btn-primary waves-effect waves-light col-md-3\" click.trigger=\"downloadFile()\"><i class=\"batch-icon batch-icon-cloud-download\"></i> Download</button></div></div></div><div class=\"\"><div class=\"card-header ml-0\" role=\"tab\" id=\"headingFour\"><h5 class=\"mb-0\"><a class=\"\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseFour\" aria-expanded=\"false\" aria-controls=\"collapseFour\">Upload</a></h5></div><div id=\"collapseFour\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"headingFour\" style=\"\"><div class=\"card-body\"><p class=\"text-left\">Atualize o preço para os seus produtos através do download e upload de planilha</p><br><form submit.delegate=\"uploadFile()\"><button type=\"submit\" if.bind=\"selectedFiles.length > 0\" class=\"btn ${ ! isUploading ? 'btn-primary' : 'btn-warning'} waves-effect waves-light col-md-3\" disable.bind=\"isUploading\"><span if.bind=\"! isUploading\"><i class=\"batch-icon batch-icon-cloud-upload\"></i> Upload </span><span if.bind=\"isUploading\"><i class=\"fa fa-circle-o-notch fa-spin\"></i> Processando arquivo</span></button> <input id=\"files\" type=\"file\" accept=\".csv\" files.bind=\"selectedFiles\" class=\"${ isUploading ? 'invisible' : ''}\"></form></div></div></div></div></template>"; });
define('text!views/components/partials/aceitePedido.html', ['module'], function(module) { module.exports = "<template><require from=\"jquery-datetimepicker/jquery.datetimepicker.min.css\"></require><require from=\"../attributes/moneyMask\"></require><require from=\"../attributes/datepicker\"></require><require from=\"../attributes/timeMask\"></require><require from=\"../valueConverters/dateFormatValueConverter\"></require><require from=\"../valueConverters/timeValueConverter\"></require><div class=\"row mb-5\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Aceite de Pedido</div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"control-label\">Tem certeza que deseja aceitar o pedido <strong>nº ${order.code}</strong>?</label><br><span class=\"badge badge-warning\"><i class=\"fa fa-warning\"></i>Atenção: a data e horários definidos abaixo devem ser cumpridos</span></div></div></div><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"control-label active\">Data de entrega<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control ${ order.deliveryDate == null ? '' : 'disabled' }\" disabled.bind=\"order.deliveryDate != null\" autocomplete=\"off\" placeholder=\"00/00/0000\" value.bind=\"order.deliveryDate | dateFormat  & validate\" datepicker></div></div></div><div class=\"row\"><div class=\"col-md-12 mt-3\"><div class=\"form-group\"><label class=\"control-label\">Horário inicial</label><div class=\"input-group\"><span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control ${ order.deliveryScheduleStart == null ? '' : 'disabled' }\" disabled.bind=\"order.deliveryScheduleStart != null\" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"order.deliveryScheduleStart | time & updateTrigger:'blur' & validate\"></div></div></div></div><div class=\"row\"><div class=\"col-md-12 mt-3\"><div class=\"form-group\"><label class=\"control-label\">Horário final</label><div class=\"input-group\"><span class=\"input-group-addon input-group-icon\"><i class=\"batch-icon batch-icon-clock\"></i> </span><input type=\"time\" class=\"time form-control ${ order.deliveryScheduleEnd == null ? '' : 'disabled' }\" disabled.bind=\"order.deliveryScheduleEnd != null\" autocomplete=\"off\" placeholder=\"HH:mm\" time value.bind=\"order.deliveryScheduleEnd | time & updateTrigger:'blur' & validate \"></div></div></div></div><div class=\"row pb-5\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"control-label active\">Informe a data de pagamento do boleto<span class=\"text-danger ml-1 bold\">*</span></label> <input type=\"text\" class=\"form-control\" autocomplete=\"off\" placeholder=\"00/00/0000\" value.bind=\"order.paymentDate | dateFormat & validate\" datepicker></div></div></div></div><div class=\"row\"><button type=\"button\" class=\"btn btn-success waves-effect waves-light mx-auto ml-5\" click.trigger=\"acceptOrder()\" if.bind=\"! processing\"><i class=\"fa fa-check mr-2\"></i>Aceitar</button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light mx-auto ml-5 mr-5\" click.trigger=\"cancel()\" if.bind=\"! processing\"><i class=\"fa fa-undo mr-2\"></i>Cancelar</button><div class=\"fa-2x text-center mx-auto\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></template>"; });
define('text!views/components/partials/selecaoDeProdutos.html', ['module'], function(module) { module.exports = "<template><require from=\"../attributes/moneyMask\"></require><require from=\"../valueConverters/moneyValueConverter\"></require><div class=\"row mt-2\"><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Mercado</label> <select class=\"form-control ${ isLoaded ? '' : 'disabled' }\" disabled.bind=\"! isLoaded\" value.bind=\"selectedClass\" change.delegate=\"updateCategories()\"><option repeat.for=\"class of classes\" model.bind=\"class\">${class.name}</option></select></div></div><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Categoria</label> <select class=\"form-control ${ isLoaded ? '' : 'disabled' }\" disabled.bind=\"! isLoaded\" value.bind=\"selectedCategory\" change.delegate=\"loadProducts()\"><option value=\"\"></option><option repeat.for=\"category of selectedClass.categories\" model.bind=\"category\">${category.name}</option></select></div></div><div class=\"col-lg-4\"><div class=\"form-group\"><label class=\"control-label\">Filtro</label> <input type=\"text\" class=\"form-control ${ isLoaded ? '' : 'disabled' }\" disabled.bind=\"! isLoaded\" value.bind=\"filter\" placeholder=\"Pesquise por Produto / Descrição\" change.trigger=\"search()\"></div></div></div><div class=\"row\" if.bind=\"isFiltered\"><div class=\"col-md-12 pb-5 mt-5\"><table class=\"table table-hover table-sm\"><thead><tr><th class=\"text-center\">Nome</th><th class=\"text-center\">Descrição</th><th class=\"text-center\">Marca</th><th class=\"text-center\">UM</th><th class=\"text-center\">Preço</th><th class=\"text-center\">Peso (kgs)</th><th></th></tr></thead><tbody><tr repeat.for=\"product of filteredProducts\"><td class=\"align-middle\">${product.name}</td><td class=\"text-center align-middle\">${product.description}</td><td class=\"align-middle\">${product.brand.name}</td><td class=\"text-center align-middle\">${product.unit.name}</td><td class=\"align-middle text-center\"><input type=\"text\" disabled.bind=\"! product.supplierProduct\" class=\"money form-control mx-auto col-md-6 text-right ${ product.supplierProduct ? '' : 'disabled' } \" autocomplete=\"off\" value.bind=\"product.supplierProduct.price | money\" money placeholder=\"000,00\"></td><td class=\"align-middle\"><input type=\"text\" disabled.bind=\"! (product.supplierProduct && product.unit.mustInformQuantity) \" class=\"money form-control mx-auto col-md-6 text-right ${ (product.supplierProduct && product.unit.mustInformQuantity) ? '' : 'disabled' } \" autocomplete=\"off\" value.bind=\"product.supplierProduct.weight | money\" money placeholder=\"000,00\"></td><td class=\"align-middle\"><div class=\"fa-2x text-center mx-auto\" if.bind=\"product.isLoading\"><i class=\"fa fa-refresh fa-spin\"></i></div><button if.bind=\"! product.supplierProduct && ! product.isLoading\" type=\"button\" class=\"btn btn-primary btn-sm waves-effect waves-light\" click.trigger=\"includeProduct(product)\">Incluir</button> <button if.bind=\"product.supplierProduct && ! product.isLoading\" type=\"button\" class=\"btn btn-success btn-sm waves-effect waves-light\" click.trigger=\"saveProduct(product)\">Salvar</button> <button if.bind=\"product.supplierProduct && ! product.isLoading\" type=\"button\" class=\"btn btn-secondary btn-sm waves-effect waves-light\" click.trigger=\"product.supplierProduct = null\">Cancelar</button></td></tr></tbody></table><div class=\"row mt-2 mb-4\"><button type=\"button\" class=\"btn btn-primary mx-auto waves-effect waves-light\" if.bind=\"alteredProducts.length > 0 && ! isLoading\" click.trigger=\"saveAll()\">Salvar</button><div class=\"fa-2x text-center mx-auto\" if.bind=\"! isLoaded && selectedClass != null\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></template>"; });
define('text!views/components/partials/historicoDeImportacao.html', ['module'], function(module) { module.exports = "<template><require from=\"../attributes/moneyMask\"></require><require from=\"../valueConverters/moneyValueConverter\"></require><div class=\"col-md-12\"><div id=\"accordion2\" role=\"tablist\" aria-multiselectable=\"true\"><div class=\"\" repeat.for=\"file of files\"><div class=\"card-header ml-0\" role=\"tab\" id=\"headingFile${file.id}\"><h5 class=\"mb-0\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse${file.id}\" aria-expanded=\"false\" aria-controls=\"collapse${file.id}\" class=\"\"> ${file.fileName} </a></h5></div><div id=\"collapse${file.id}\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\" style=\"\"><div class=\"card-body\"><p class=\"text-right\">Usuário : ${file.uploadedBy.name}</p><p class=\"text-right\">Data: ${dataAtualFormatada(file.uploadedOn)}</p><p class=\"text-left\">Os produtos abaixo foram atualizados com o upload desse arquivo</p><table class=\"table table-hover\"><thead><tr><th>Nº da Linha</th><th>Nome</th><th>Descrição</th><th>Mercado</th><th>Categoria</th><th>UM</th><th>Marca</th><th class=\"text-center\">Preço Antigo</th><th class=\"text-center\">Novo Preço</th><th>Status</th></tr></thead><tbody><tr repeat.for=\"row of file.rows\"><td>${row.lineNumber}</td><td>${row.supplierProduct.product.name}</td><td>${row.supplierProduct.product.description}</td><td>${row.supplierProduct.product.category.productClass.name}</td><td>${row.supplierProduct.product.category.name}</td><td>${row.supplierProduct.product.unit.name}</td><td>${row.supplierProduct.product.brand.name}</td><td class=\"text-center\">${row.oldPrice.toFixed(2)}</td><td class=\"text-center\">${row.newPrice.toFixed(2)}</td><td><span class=\"badge badge-success\" if.bind=\"row.status == 0\">Sucesso</span> <span class=\"badge badge-danger\" if.bind=\"row.status == 1\">Erro</span></td></tr></tbody></table></div></div></div></div></div></template>"; });
define('text!views/components/partials/deleteBuyList.html', ['module'], function(module) { module.exports = "<template><require from=\"jquery-datetimepicker/jquery.datetimepicker.min.css\"></require><require from=\"../attributes/moneyMask\"></require><require from=\"../attributes/datepicker\"></require><require from=\"../valueConverters/dateFormatValueConverter\"></require><div class=\"row mb-5\"><div class=\"col-md-12\"><div class=\"card\"><div class=\"card-header\">Deleção de lista</div><div class=\"card-body\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"control-label\">Tem certeza que deseja apagar a lista de compras <strong>${list.name}</strong>?</label></div></div></div></div><div class=\"row\"><button type=\"button\" class=\"btn btn-success waves-effect waves-light mx-auto ml-5\" click.trigger=\"deleteList()\" if.bind=\"! processing\"><i class=\"fa fa-check mr-2\"></i>Apagar</button> <button type=\"button\" class=\"btn btn-secondary waves-effect waves-light mx-auto ml-5 mr-5\" click.trigger=\"cancel()\" if.bind=\"! processing\"><i class=\"fa fa-undo mr-2\"></i>Cancelar</button><div class=\"fa-2x text-center mx-auto\" if.bind=\"processing\"><i class=\"fa fa-refresh fa-spin\"></i></div></div></div></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map