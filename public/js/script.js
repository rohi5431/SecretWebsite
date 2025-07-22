function isEmail(email){
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

$(document).ready(function(){

    $("#register-submit").click(function(e){
        e.preventDefault();

        var missing = "";
        var error = "";

        if($("#reg-email").val() === ""){
            missing += "Email is missing\n";
        }
        if($("#reg-password").val() === ""){
            missing += "Password is missing\n";
        }
        if($("#reg-confirm-password").val() === ""){
            missing += "Confirm password is missing\n";
        }

        if($("#reg-email").val() !== "" && !isEmail($("#reg-email").val())){
            error += "Email is not valid\n";
        }

        if($("#reg-password").val() !== ""){
            var password = $("#reg-password").val();
            var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if(!passwordPattern.test(password)){
                error += "Password must be at least 8 characters with uppercase, lowercase, and numbers\n";
            }
        }

        if($("#reg-password").val() !== $("#reg-confirm-password").val()){
            error += "Passwords do not match\n";
        }

        if(missing === "" && error === ""){
            $("#register-form").submit();
        } else{
            alert(missing + error);
        }
    });

    
    $("#login-submit").click(function(e){
        e.preventDefault();

        var loginMissing = "";
        var loginError = "";

        if($("#login-email").val() === ""){
            loginMissing += "Email is missing\n";
        }
        if($("#login-password").val() === ""){
            loginMissing += "Password is missing\n";
        }

        if($("#login-email").val() !== "" && !isEmail($("#login-email").val())){
            loginError += "Email is not valid\n";
        }

        if(loginMissing === "" && loginError === ""){
            $("#login-form").submit();
        } else{
            alert(loginMissing + loginError);
        }
    });

    
    $("#togglePassword").click(function(){
        let pass = $("#reg-password");
        let type = pass.attr("type") === "password" ? "text" : "password";
        pass.attr("type", type);
        $(this).toggleClass("fa-eye fa-eye-slash");
    });

    $("#toggleConfirmPassword").click(function(){
        let cpass = $("#reg-confirm-password");
        let type = cpass.attr("type") === "password" ? "text" : "password";
        cpass.attr("type", type);
        $(this).toggleClass("fa-eye fa-eye-slash");
    });


    $("#toggleLoginPassword").click(function(){
        let loginPass = $("#login-password");
        let type = loginPass.attr("type") === "password" ? "text" : "password";
        loginPass.attr("type", type);
        $(this).toggleClass("fa-eye fa-eye-slash");
    });
});

function toggleMenu() {
    const nav = document.getElementById('navItems');
    nav.classList.toggle('show');
}

const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    const successMessage = urlParams.get('success');

    if(errorMessage){
       alert(decodeURIComponent(errorMessage));
    }

    if(successMessage){
       alert(decodeURIComponent(successMessage));
    }