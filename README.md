<!-- update user -->
![alt text](updateUser.png)
j'ai ajouté le fichier 'authorize.ts' pour donner l'accès à l'admin seulement d'executer cette méthode.

<!-- update connected user -->
En utilisant la route '/users/me', postman pense que le '/me' est un id donc il execute la méthode updateUser. J'ai changé l'url à '/connecteduser' pour que ça fonctionne
![alt text](updateConnectedUser.png)

<!-- login -->
Si l'e-mail est incorrect, il m'affiche User not found,
si le mot de passe est incorrect, il m'affiche Password Incorrect
![alt text](<login denied.png>)
![alt text](<login password incorrect.png>)

<!-- delete user -->
si le role n'est pas admin, il est interdit de supprimer l'user
![alt text](<deleteUser forbidden.png>) ![alt text](deleteUser.png)

<!-- change password -->
La fonction vérifie l'ancien mot de passe et demande de saisir un nouveau.
si l'ancien mot de passe est incorrect, la fonction ne s'execute pas :
![alt text](<changePassword incorrect.png>)
mot de passe changé :
![alt text](changePassword.png)
login après la modification du mot de passe :
![alt text](<login after password change.png>)
La fonction ne s'execute pas si on saisit pas l'ancien ou le nouveau mot de passe :
![alt text](<password required.png>)