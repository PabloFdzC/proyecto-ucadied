# proyecto-ucadied
Hay que instalar las dependencias cuando lo bajen entonces lo hacen
con npm install y si también quieren las de react se meten a la
carpeta de vista y ponen el mismo comando. No las puse porque las 
de react son un montón.

Para correr el server pueden usar el comando npm run server y si
lo quieren correr con react también es npm run dev

## Smart commits
Ya está lo de smart commits. Tienen que fijarse que el correo que
usan para el Jira es el mismo que el que usan para hacer los commits,
entonces si hacen el commit desde la consola se pueden fijar cuál
tienen puesto con el comando:

git config --list

Y si tienen uno que no es lo cambian con:

git config --global user.email "correo@micorreo.com"

Ya cuando hacen el commit se pone:

git commit -m "Llave-de-incidencia \#Donde-lo-quieren-mover Explicación del"

Por ejemplo:

git commit -m "PU-22 \#Done Investigar sobre smart commits"

Y luego ya hacen el push normal
