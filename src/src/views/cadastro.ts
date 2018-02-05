import { StateRegistrationRepository } from '../repositories/stateRegistrationRepository';
import { StateRegistration } from '../domain/stateRegistration';
import { NotificationService } from '../services/notificationService';
import { Supplier } from '../domain/supplier';
import { Identity } from '../domain/identity';
import { IdentityService } from '../services/identityService';
import { SupplierRepository } from '../repositories/supplierRepository';
import { Aurelia, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { Rest, Config } from 'aurelia-api';
import 'twitter-bootstrap-wizard';

@autoinject
export class Cadastro{

	supplier : Supplier;
	stateRegistrations : StateRegistration[];

    constructor(
		private repository : SupplierRepository, 
		private service : IdentityService,
		private nService : NotificationService,
		private stateRepo: StateRegistrationRepository ) {
    }

	 /**
	 * @param  {string} fieldID:					the ID of the field you are validating
	 * @param  {string} type:						accepts: [email, numeric, alphanumeric, alphabet, password]
	 * @param  {int} required:						(optional field) accepts: 0 or 1. whether or not this feild is required
	 * @param  {integer} lengthMin:					(optional field) the min length of the password
	 * @param  {integer} lengthMax:					(optional field) the max length of the password
	 * @return {string, integer or Boolean}			this will return an error message or boolean or integer
	 */
	qp_form_validation(fieldID?: any, type?: any, required?: any, lengthMin?: any, lengthMax?: any) : boolean{
		/* Set defaults */
		if(required === undefined || !required || required == ""){
			required = 0;
		}else{
			required = 1;
		}
		if(lengthMin === undefined || !lengthMin || lengthMin == ""){
			lengthMin = 6;
		}

		if(lengthMax === undefined || !lengthMax || lengthMax == ""){
			lengthMax = 30;
		}

		var value = $(fieldID).val();

		$(fieldID).closest('form').find('*').removeClass('border-danger');
		$(fieldID).closest('form').find('*').removeClass('has-danger');
		$(fieldID).closest('form').find('*').removeClass('text-danger');

		$(fieldID).closest('form').find('.form-control-feedback').remove();


				return true;
	}

	/**
		 * qp_form_validate_numeric handles numeric validation
		 * @param  {integer} numeric:	enter numbers only
		 * @return {boolean}
		 */
		qp_form_validate_numeric(numeric) : any{
			var reg = new RegExp("^[0-9]+$");
			return reg.test(numeric);
		}
		
		/**
		 * qp_form_validate_alphanumeric handles text, numbers and space validation
		 * @param  {string} alphanumeric:	enter text, numbers and space only
		 * @return {boolean}
		 */
		qp_form_validate_alphanumeric(alphanumeric) : any{
			var reg = new RegExp("^[a-zA-Z 0-9,.]+$");
			return reg.test(alphanumeric);
		}
		
		/**
		 * qp_form_validate_alphabet handles text and space
		 * @param  {string} alphabet:	enter text and space
		 * @return {boolean}
		 */
		qp_form_validate_alphabet(alphabet) : any{
			var reg = new RegExp("^[a-zA-Z ]+$");
			return reg.test(alphabet);
		}

	

		/**
		 * qp_form_validate_email handles email validation
		 * @param  {string} email:	enter valid email
		 * @return {boolean}
		 */
		 qp_form_validate_email(email) : any{
			var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return re.test(email);
		}

				/**
		 * qp_form_validate_password handles password validation
		 * @param  {string} password:		accepts alphanumeric characters
		 * @param  {integer} lengthMin:		the minimum length the password should be
		 * @param  {integer} lengthMax:		the maximum length the password should be
		 * @return {boolean or string}		returns an error message or the boolean response
		 */
		 qp_form_validate_password(password, lengthMin, lengthMax) : any{
			var passwordLengthStatus = this.qp_form_validate_stringlength(password, lengthMin, lengthMax);
			if(passwordLengthStatus != true){
				return passwordLengthStatus;
			}else{
				var passwordStatus = this.qp_form_validate_alphanumeric(password);
				if(passwordStatus == true){
					return true;
				}else{
					var message = "Password field can only contain letters, numbers, commas and fullstops but NO spaces.";
					return message;
				}
			}
		}



		/**
		 * qp_form_validate_stringlength checks the string length
		 * @param  {string} str				accepts any string
		 * @param  {integer} lengthMin:		the minimum length the password should be
		 * @param  {integer} lengthMax:		the maximum length the password should be
		 * @return {boolean or string}		returns an error message or the boolean response
		 */
		 qp_form_validate_stringlength(str, lengthMin, lengthMax) : any {
			var n = str.length;

			if(n < lengthMin){
				var message = "This field must be at least " + lengthMin + " characters long";
				return message;
			}else if(n > lengthMax){
				var message = "This field must not be more than " + lengthMax + " characters long";
				return message;
			}else{
				return true;
			}
		}

	runScript() : void{
		var thisForm = '#rootwizard-1';

		var outher = this;

		if( $(thisForm).length) {

			// Prevent page from jumping when +
			$('.pager li a, .pager li span').on('click', function(e){
				e.preventDefault();
			});

			var wizardStagesTotal = $(thisForm + ' .tab-pane').length;
			
			( <any> $)(thisForm).bootstrapWizard({onNext: function(tab, navigation, index) {

				// Note: index is the next frame not the current one
				if(index == 1) {
					if(outher.qp_form_validation('#wizard-stage-1 .wizard-stage-1-username', 'alphanumeric', null, null, null) !== true){
						return false;
					}
					if(outher.qp_form_validation('#wizard-stage-1 .wizard-stage-1-email', 'email') !== true){
						return false;
					}
					if(outher.qp_form_validation('#wizard-stage-1 .wizard-stage-1-password', 'password') !== true){
						return false;
					}

					// $('#tab1').removeClass('active');
					// $('#tab2').addClass('active');
				}

				if(index == 2){
					$(".form-wizard-review-block").append("<p><strong>Username:</strong> " + $(".wizard-stage-1-username").val() + "</p>");
					$(".form-wizard-review-block").append("<p><strong>Email:</strong> " + $(".wizard-stage-1-email").val() + "</p>");
					$(".form-wizard-review-block").append("<p><strong>password:</strong> *******</p>");
					$(".form-wizard-review-block").append("<p><strong>Telephone:</strong> " + $(".wizard-stage-2-optional-1").val() + "</p>");
					$(".form-wizard-review-block").append("<p><strong>Your Address:</strong> " + $(".wizard-stage-2-optional-2").val() + "</p>");
					$(".form-wizard-review-block").append("<p><strong>Write something about yourself:</strong> " + $(".wizard-stage-2-optional-3").val() + "</p>");

					// $('#tab2').removeClass('active');
					// $('#tab3').addClass('active');
				}

				if(index <= wizardStagesTotal){
					$(thisForm + ' .tab-pane').eq(index).addClass('active');
					$(thisForm + ' .tab-pane').eq(index - 1).removeClass('active');
				}

			}, onPrevious: function(tab, navigation, index) {
				// Note: index is the previous frame not the current one
				if(index !== -1){
					$(thisForm + ' .tab-pane').eq(index).addClass('active');
					$(thisForm + ' .tab-pane').eq(index + 1).removeClass('active');
				}
			}, onTabShow: function(tab, navigation, index) {
				// Update Progress Bar
				var total = navigation.find('li').length;
				var current = index + 1;
				var completionPercentage = (current / total) * 100;

				var progressBar = $(thisForm).closest('.card').find(".card-header .progress-bar");

				progressBar.css({"width": completionPercentage + "%"}).attr("aria-valuenow", completionPercentage);
			}, onTabClick: function(tab, navigation, index){
				return false;
			}});
		}
	}

    attached() : void{
        
		this.runScript();
		this.loadData();
    } 

	loadData() : void {

		var identity = this.service.getIdentity();

		this.repository
            .getSupplier(identity.id)
            .then( (supplier : Supplier) => 
			{ 
                this.supplier = supplier;
            }).catch( e => 
            {
                this.nService.presentError(e);
            });

		this.stateRepo
				.getAll()
				.then( (data : StateRegistration[]) => 
				{ 
					this.stateRegistrations = data;
				}).catch( e => 
				{
					this.nService.presentError(e);
				});
	}

} 