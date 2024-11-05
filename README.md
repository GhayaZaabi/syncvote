<!-- update user -->
![alt text](updateUser.png)

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