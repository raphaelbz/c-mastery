import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   C MASTERY — Study App by Raphaël
   Apple-inspired, LaTeX-rendered, syntax-highlighted, mobile-optimized
   ═══════════════════════════════════════════════════════════════════════════ */

// ── QUESTION BANK ────────────────────────────────────────────────────────────
const Q = [
  // CH1 — Présentation du langage
  { id:1, ch:1, tp:"Histoire", q:"En quelle année le langage C a-t-il été créé ?", o:["1969","1972","1978","1983"], c:1, ex:"Le langage C a été créé en **1972** par Dennis Ritchie aux Bell Labs." },
  { id:2, ch:1, tp:"Histoire", q:"Qui a créé le langage C ?", o:["Brian Kernighan","Kenneth Thomson","Dennis Ritchie","Richard Stallman"], c:2, ex:"**Dennis Ritchie** a créé le C en 1972." },
  { id:3, ch:1, tp:"Histoire", q:"Le K&R fait référence à :", o:["Un compilateur","Un livre de référence sur le C","Une norme ISO","Un IDE"], c:1, ex:"Le **K&R** est le livre écrit par Kernighan et Ritchie (1978), la « bible » du C." },
  { id:4, ch:1, tp:"Histoire", q:"GCC a été créé par :", o:["Dennis Ritchie","Linus Torvalds","Richard Stallman","Kenneth Thomson"], c:2, ex:"**GCC** (GNU C Compiler) a été créé par Richard Stallman en 1987." },
  { id:5, ch:1, tp:"Histoire", q:"Pourquoi utilise-t-on le mot `print` pour afficher du texte ?", o:["Par convention","Car les premiers terminaux étaient des imprimantes","C'est un acronyme","Référence au langage B"], c:1, ex:"Les premiers terminaux n'avaient **pas d'écran**, seulement une imprimante." },
  { id:6, ch:1, tp:"Syntaxe", q:"Comment se termine une instruction en C ?", o:["Par un point `.`","Par un point-virgule `;`","Par un retour à la ligne","Par deux-points `:`"], c:1, ex:"Chaque instruction se termine par `;`" },
  { id:7, ch:1, tp:"Syntaxe", q:"Comment délimite-t-on un bloc d'instructions en C ?", o:["`begin`/`end`","Des parenthèses `( )`","Des accolades `{ }`","L'indentation"], c:2, ex:"En C, les blocs sont encadrés par `{ }`." },
  { id:8, ch:1, tp:"Syntaxe", q:"Quel commentaire est valide en C ANSI ?", o:["`// commentaire`","`/* commentaire */`","`# commentaire`","`-- commentaire`"], c:1, ex:"En C ANSI : `/* ... */`. Le `//` est C99." },
  { id:9, ch:1, tp:"Syntaxe", q:"Quelle est la relation entre `for` et `while` en C ?", o:["`for` est plus rapide","`for` est une autre façon d'écrire un `while`","`while` ne peut pas itérer","`for` est limité à 100 itérations"], c:1, ex:"La boucle `for` est simplement du sucre syntaxique pour `while`." },
  { id:10, ch:1, tp:"Syntaxe", q:"Que fait la boucle `do...while` par rapport à `while` ?", o:["Elle est plus rapide","Elle passe au moins une fois dans la boucle","Elle ne peut pas avoir de condition","Rien de différent"], c:1, ex:"`do { ... } while(cond);` garantit **au moins un passage**." },
  { id:11, ch:1, tp:"Opérations", q:"Que vaut `15/2` si les deux opérandes sont `int` ?", o:["7.5","7","8","Erreur de compilation"], c:1, ex:"Division entière entre deux `int` : `15/2 = 7`." },
  { id:12, ch:1, tp:"Opérations", q:"Que signifie l'opérateur `%` en C ?", o:["Pourcentage","Modulo (reste de la division entière)","Division flottante","Puissance"], c:1, ex:"`%` retourne le **reste** de la division entière." },
  { id:13, ch:1, tp:"Opérations", q:"Que fait `x++` ?", o:["`x = x * x`","`x = x + 1`","`x = x - 1`","`x = 0`"], c:1, ex:"`x++` est équivalent à `x = x + 1`." },
  { id:14, ch:1, tp:"Opérations", q:"Quelle est la différence entre `x++` et `++x` ?", o:["Aucune","`x++` retourne l'ancienne valeur, `++x` la nouvelle","`++x` est plus rapide","`x++` n'existe pas en C ANSI"], c:1, ex:"`x++` → ancienne valeur, `++x` → nouvelle valeur." },
  { id:15, ch:1, tp:"Opérations", q:"Que signifie `x += 3` ?", o:["`x = 3`","`x = x + 3`","`x = x * 3`","`x == 3`"], c:1, ex:"Raccourci : `x += 3` ≡ `x = x + 3`." },
  { id:16, ch:1, tp:"Types", q:"Quelle est la taille typique d'un `int` ?", o:["1 octet","2 octets","4 octets","8 octets"], c:2, ex:"Un `int` fait typiquement **4 octets** (32 bits)." },
  { id:17, ch:1, tp:"Types", q:"Quelle est la taille typique d'un `char` ?", o:["1 octet","2 octets","4 octets","8 octets"], c:0, ex:"Un `char` fait **1 octet** (8 bits)." },
  { id:18, ch:1, tp:"Types", q:"Un `unsigned char` peut contenir des valeurs entre :", o:["-128 et 127","0 et 255","0 et 127","-256 et 255"], c:1, ex:"`unsigned char` : de **0** à **255** (8 bits non signés)." },
  { id:19, ch:1, tp:"Types", q:"En C, les booléens sont représentés par :", o:["Le type `bool`","Le type `boolean`","Des entiers (`0` = faux, non-`0` = vrai)","Le type `bit`"], c:2, ex:"Pas de type booléen en C ANSI : `0` = faux, tout le reste = vrai." },
  { id:20, ch:1, tp:"Types", q:"Que signifie le « typage statique » en C ?", o:["Les variables ne changent pas de valeur","Chaque variable possède un type fixe","Le programme est non modifiable","Les types sont calculés à l'exécution"], c:1, ex:"**Typage statique** : le type d'une variable est fixé à la déclaration." },
  { id:21, ch:1, tp:"Fonctions", q:"Quelle fonction est toujours exécutée en premier ?", o:["`init()`","`start()`","`main()`","`run()`"], c:2, ex:"Le programme C exécute toujours `main()` en premier." },
  { id:22, ch:1, tp:"Fonctions", q:"Que doit retourner `main` ?", o:["`void`","Un entier (`int`)","Un `char`","Un flottant"], c:1, ex:"`main` retourne un `int` : **0** si succès." },
  { id:23, ch:1, tp:"Fonctions", q:"En C ANSI, où doivent être déclarées les variables ?", o:["N'importe où","Au début de la fonction, avant toute instruction","À la fin","En dehors de la fonction"], c:1, ex:"C ANSI : déclarations **au début du bloc**, avant les instructions." },
  { id:24, ch:1, tp:"Printf", q:"Quel format pour afficher un entier avec `printf` ?", o:["`%s`","`%f`","`%d`","`%c`"], c:2, ex:"`%d` affiche un entier en décimal signé." },
  { id:25, ch:1, tp:"Printf", q:"Quel format pour un flottant ?", o:["`%d`","`%f`","`%s`","`%c`"], c:1, ex:"`%f` affiche un nombre flottant." },
  { id:26, ch:1, tp:"Printf", q:"Que signifie `%.2f` dans `printf` ?", o:["Afficher 2 chiffres","2 chiffres après la virgule","Multiplier par 2","Afficher en base 2"], c:1, ex:"`%.2f` → flottant avec **2 décimales**." },
  { id:27, ch:1, tp:"Printf", q:"Quel format pour un `long` ?", o:["`%d`","`%ld`","`%hd`","`%f`"], c:1, ex:"`%ld` pour un `long` (`l` = long)." },
  { id:28, ch:1, tp:"Printf", q:"Que fait `\\n` dans `printf` ?", o:["Affiche un antislash","Retour à la ligne","Tabulation","Fin de chaîne"], c:1, ex:"`\\n` = **retour à la ligne** (newline)." },
  { id:29, ch:1, tp:"Compilation", q:"Quel compilateur est utilisé dans le cours ?", o:["`clang`","`gcc`","`msvc`","`tcc`"], c:1, ex:"Le cours utilise `gcc` (GNU C Compiler)." },
  { id:30, ch:1, tp:"Compilation", q:"Que fait l'option `-Wall` de `gcc` ?", o:["Compile plus vite","Active tous les avertissements","Optimise le code","Produit un fichier `.wall`"], c:1, ex:"`-Wall` = **all warnings** activés." },
  { id:31, ch:1, tp:"Compilation", q:"Nom par défaut de l'exécutable produit par `gcc` ?", o:["`programme`","`output`","`a.out`","`main`"], c:2, ex:"Par défaut : `a.out`." },
  { id:32, ch:1, tp:"Compilation", q:"L'option `-o` de `gcc` sert à :", o:["Optimiser","Nommer l'exécutable","Ouvrir un fichier","Mode objet"], c:1, ex:"`-o nom` donne un nom à l'exécutable." },
  { id:33, ch:1, tp:"Types", q:"Quelle relation de taille est garantie ?", o:["`char ≤ short ≤ int ≤ long`","`char = short = int`","`int < char`","`long < short`"], c:0, ex:"Garanti : `char ≤ short ≤ int ≤ long`." },
  { id:34, ch:1, tp:"Types", q:"Que vaut `(unsigned char)(200 * 2)` ?", o:["400","144","0","Erreur"], c:1, ex:"Arithmétique modulaire : $400 \\bmod 256 = 144$." },
  { id:35, ch:1, tp:"Printf", q:"Quel format pour l'hexadécimal ?", o:["`%d`","`%o`","`%x`","`%b`"], c:2, ex:"`%x` = hexadécimal (base 16)." },
  { id:36, ch:1, tp:"Getchar", q:"`getchar()` lit :", o:["Un entier","Un caractère sur stdin","Une chaîne","Un fichier"], c:1, ex:"`getchar()` lit **un caractère** sur l'entrée standard." },
  // CH2 — Types et structures de contrôle avancés
  { id:37, ch:2, tp:"Makefile", q:"Quel est le rôle de `make` ?", o:["Tout recompiler","Ne recompiler que le nécessaire","Créer des `.c`","Exécuter le programme"], c:1, ex:"`make` ne recompile que les fichiers **modifiés**." },
  { id:38, ch:2, tp:"Makefile", q:"Les indentations dans un Makefile doivent être :", o:["Des espaces","Des tabulations","N'importe quoi","Deux espaces"], c:1, ex:"**Tabulations** obligatoires dans les Makefiles." },
  { id:39, ch:2, tp:"Makefile", q:"Que fait `make -B` ?", o:["Mode binaire","Tout reconstruire","Lance gdb","Affiche les erreurs"], c:1, ex:"`make -B` force la **reconstruction complète**." },
  { id:40, ch:2, tp:"Tableaux", q:"Un tableau C connaît-il sa propre taille ?", o:["Oui, `.length`","Oui, `len()`","Non, il faut la transmettre","Oui, `sizeof`"], c:2, ex:"Pas de `len()` en C : il faut **passer la taille** en paramètre." },
  { id:41, ch:2, tp:"Tableaux", q:"En C ANSI, peut-on écrire `int tab[n]` où `n` est une variable ?", o:["Oui","Non, taille connue à la compilation","Oui si `n < 100`","Oui avec `malloc`"], c:1, ex:"C ANSI : la taille d'un tableau sur la pile doit être **connue à la compilation**." },
  { id:42, ch:2, tp:"Chaînes", q:"Comment se termine une chaîne en C ?", o:["`\\n`","`\\0`","`EOF`","Un espace"], c:1, ex:"Terminées par le caractère nul `'\\0'`." },
  { id:43, ch:2, tp:"Chaînes", q:"`char *s = \"Bonjour\"` vs `char s[] = \"Bonjour\"` :", o:["Aucune différence","Avec `*`, la chaîne n'est pas modifiable","Avec `[]` elle est plus longue","Avec `*` c'est un entier"], c:1, ex:"`char *s` → chaîne en mémoire **statique, non modifiable**." },
  { id:44, ch:2, tp:"Enum", q:"À quoi sert un `enum` ?", o:["Type à nombre fini de valeurs","Créer un tableau","Définir une fonction","Allouer de la mémoire"], c:0, ex:"`enum` crée un type avec des **valeurs nommées**." },
  { id:45, ch:2, tp:"Enum", q:"Par défaut, la première valeur d'un `enum` vaut :", o:["-1","0","1","Indéfini"], c:1, ex:"Première valeur = **0** par défaut." },
  { id:46, ch:2, tp:"Struct", q:"Comment accéder à un champ d'une `struct` ?", o:["`s->champ`","`s.champ`","`s[champ]`","`s::champ`"], c:1, ex:"Accès direct : `variable.champ`  (et `->` pour les pointeurs)." },
  { id:47, ch:2, tp:"Struct", q:"Passer une `struct` en paramètre crée :", o:["Une modification directe","Une copie (passage par valeur)","Un pointeur automatique","Erreur de compilation"], c:1, ex:"**Passage par valeur** = copie locale. L'original n'est pas modifié." },
  { id:48, ch:2, tp:"Union", q:"Taille d'une `union` par rapport à ses champs ?", o:["La somme","Le maximum","Le minimum","Toujours 8 octets"], c:1, ex:"`sizeof(union)` = **max** des tailles des champs." },
  { id:49, ch:2, tp:"Union", q:"Peut-on utiliser deux champs d'une `union` simultanément ?", o:["Oui","Non, seulement le dernier affecté","Oui en lecture seule","Ça dépend"], c:1, ex:"Un seul champ **actif** à la fois dans une `union`." },
  { id:50, ch:2, tp:"Typedef", q:"Que fait `typedef` ?", o:["Crée un nouveau type","Crée un alias pour un type existant","Supprime un type","Déclare une variable"], c:1, ex:"`typedef` = **alias** cosmétique, pas un nouveau type." },
  { id:51, ch:2, tp:"Contrôle", q:"L'opérateur ternaire s'écrit :", o:["`if/else`","`cond ? e1 : e2`","`switch/case`","`cond -> e1 | e2`"], c:1, ex:"`condition ? expression_1 : expression_2`" },
  { id:52, ch:2, tp:"Contrôle", q:"Que fait `break` dans un `switch` ?", o:["Quitte la fonction","Quitte le programme","Empêche le fall-through","Passe au `case` suivant"], c:2, ex:"Sans `break`, l'exécution **tombe** dans les cases suivants." },
  { id:53, ch:2, tp:"Contrôle", q:"Que fait `continue` dans une boucle ?", o:["Quitte la boucle","Saute au début du corps de boucle","Continue la ligne suivante","Quitte la fonction"], c:1, ex:"`continue` **saute** la fin du corps et reprend l'itération." },
  { id:54, ch:2, tp:"Binaire", q:"$1562$ en base 7 donne :", o:["$10320_7$","$31042_7$","$12345_7$","$20301_7$"], c:0, ex:"$1562 = 1\\times7^4 + 0\\times7^3 + 3\\times7^2 + 2\\times7^1 + 0\\times7^0 = 10320_7$" },
  { id:55, ch:2, tp:"Binaire", q:"L'opérateur `~` en C fait :", o:["La multiplication","Le complément bit à bit","La division","Le modulo"], c:1, ex:"`~` = **NOT** bit à bit (inverse chaque bit)." },
  { id:56, ch:2, tp:"Binaire", q:"Que vaut `3 & 5` ?", o:["7","1","6","5"], c:1, ex:"`0011 & 0101 = 0001` → **1**" },
  { id:57, ch:2, tp:"Binaire", q:"Que vaut `3 | 5` ?", o:["1","5","7","8"], c:2, ex:"`0011 | 0101 = 0111` → **7**" },
  { id:58, ch:2, tp:"Binaire", q:"Que vaut `3 ^ 5` ?", o:["6","1","7","8"], c:0, ex:"`0011 ^ 0101 = 0110` → **6** (XOR)" },
  { id:59, ch:2, tp:"Binaire", q:"Que vaut `3 << 5` ?", o:["15","96","60","35"], c:1, ex:"`3 << 5` = $3 \\times 2^5 = 96$" },
  { id:60, ch:2, tp:"Binaire", q:"Comment obtenir `01000000`₂ en une seule expression ?", o:["`1<<6`","`1>>6`","`64%2`","`2^6`"], c:0, ex:"`1<<6` = $2^6 = 64$ = `01000000`₂" },
  // CH3 — Codage et mémoire
  { id:61, ch:3, tp:"Codage", q:"À quoi sert fondamentalement un type en C ?", o:["Rendre le code joli","Indiquer comment interpréter les bits en mémoire","Choisir la couleur d'affichage","Gérer les erreurs"], c:1, ex:"Le type dit au compilateur **comment interpréter** les bits en mémoire." },
  { id:62, ch:3, tp:"Codage", q:"Comment est stocké `0xCAFE0230` en little-endian ?", o:["`CA FE 02 30`","`30 02 FE CA`","`02 30 CA FE`","`FE CA 30 02`"], c:1, ex:"Little-endian : **poids faible en premier** → `30 02 FE CA`." },
  { id:63, ch:3, tp:"Codage", q:"x86-64 utilise quel boutisme ?", o:["Big-endian","Little-endian","Les deux","Aucun"], c:1, ex:"x86, x86-64, ARM → **little-endian**." },
  { id:64, ch:3, tp:"Codage", q:"Comment est codé `-1` en `int` (complément à 2) ?", o:["`10000001`","Tous les bits à 1 (`0xFFFFFFFF`)","00000001","10000000"], c:1, ex:"$-1$ = `~0` = tous les bits à **1**." },
  { id:65, ch:3, tp:"Codage", q:"Pour obtenir $-n$ en complément à 2 :", o:["$n + 1$","$\\sim n$","$\\sim n + 1$","$n - 1$"], c:2, ex:"$-n = \\sim n + 1$ (complément + 1)." },
  { id:66, ch:3, tp:"Codage", q:"La norme des flottants est :", o:["ASCII","UTF-8","IEEE 754","POSIX"], c:2, ex:"**IEEE 754** : norme universelle pour les flottants." },
  { id:67, ch:3, tp:"Codage", q:"Composition d'un `float` (32 bits) :", o:["1 signe + 8 exposant + 23 mantisse","1 signe + 11 exposant + 52 mantisse","32 bits de mantisse","8 signe + 24 valeur"], c:0, ex:"`float` = 1 bit signe + 8 bits exposant + 23 bits mantisse." },
  { id:68, ch:3, tp:"Alignement", q:"Pourquoi le compilateur ajoute-t-il du padding ?", o:["Lisibilité","Contraintes d'alignement mémoire","Sécurité","C'est un bug"], c:1, ex:"Un champ de $n$ octets doit être à une adresse **multiple de $n$**." },
  { id:69, ch:3, tp:"Sizeof", q:"`sizeof` renvoie la taille en :", o:["Bits","Octets (bytes)","Kilooctets","Mots"], c:1, ex:"`sizeof` → taille en **bytes** (octets)." },
  { id:70, ch:3, tp:"Codage", q:"En C, `'A'` et `65` représentent :", o:["Deux choses différentes","Le même nombre (table ASCII)","Une erreur","Un `char` et un `int` incompatibles"], c:1, ex:"`'A'` = 65 (table ASCII). Pas de différence `char`/entier." },
  // CH4 — Pointeurs et mémoire
  { id:71, ch:4, tp:"Mémoire", q:"Les 3 parties de la mémoire d'un programme :", o:["RAM, ROM, Cache","DATA, STACK, HEAP","Code, Données, Réseau","Pile, File, Arbre"], c:1, ex:"**DATA** (statique), **STACK** (pile), **HEAP** (tas)." },
  { id:72, ch:4, tp:"Mémoire", q:"La pile (STACK) se remplit :", o:["Du bas vers le haut","Du haut vers le bas","Aléatoirement","Du centre vers les bords"], c:1, ex:"La pile est remplie **du haut vers le bas**." },
  { id:73, ch:4, tp:"Mémoire", q:"Débordement de pile =", o:["Ralentissement","Stack overflow (plantage)","La mémoire augmente","Rien"], c:1, ex:"**Stack overflow** = plantage." },
  { id:74, ch:4, tp:"Pointeurs", q:"Un pointeur est :", o:["Un entier","Une adresse mémoire","Un tableau","Une fonction"], c:1, ex:"Pointeur = type représentant une **adresse mémoire**." },
  { id:75, ch:4, tp:"Pointeurs", q:"Que fait `&` devant une variable ?", o:["Multiplication","Retourne son adresse","ET logique","Déréférence"], c:1, ex:"`&a` → **adresse** de `a`." },
  { id:76, ch:4, tp:"Pointeurs", q:"Que fait `*p` quand `p` est un pointeur ?", o:["L'adresse de `p`","La valeur pointée par `p`","`p` au carré","Rien"], c:1, ex:"`*p` = **déréférencement** : accède à la valeur à l'adresse `p`." },
  { id:77, ch:4, tp:"Pointeurs", q:"Passage par valeur vs par référence :", o:["Aucune différence en C","Valeur = copie, référence = pointeur","Référence est plus lent","Valeur modifie l'original"], c:1, ex:"**Valeur** : copie. **Référence** : on passe l'adresse (`&x`)." },
  { id:78, ch:4, tp:"Pointeurs", q:"`p->champ` est équivalent à :", o:["`p.champ`","`(*p).champ`","`&p.champ`","`p[champ]`"], c:1, ex:"`p->champ` ≡ `(*p).champ`" },
  { id:79, ch:4, tp:"Tableaux", q:"`tab[3]` est équivalent à :", o:["`*(tab + 3)`","`tab + 3`","`&tab[3]`","`tab * 3`"], c:0, ex:"`tab[3]` = `*(tab + 3)` (arithmétique de pointeur)." },
  { id:80, ch:4, tp:"Tableaux", q:"`sizeof(tab)` pour `int tab[3]` vaut :", o:["3","4","12","8"], c:2, ex:"$3 \\times$ `sizeof(int)` $= 3 \\times 4 = 12$." },
  { id:81, ch:4, tp:"Tableaux", q:"`sizeof(p)` pour `int *p` (64 bits) :", o:["4","8","12","Dépend du tableau"], c:1, ex:"Un pointeur 64 bits = **8 octets**, toujours." },
  { id:82, ch:4, tp:"Allocation", q:"`malloc()` alloue sur :", o:["La pile (stack)","Le tas (heap)","La DATA","Les registres"], c:1, ex:"`malloc` → allocation dynamique sur le **heap**." },
  { id:83, ch:4, tp:"Allocation", q:"Que fait `free(ptr)` ?", o:["Supprime `ptr`","Libère la mémoire à l'adresse `ptr`","Met `ptr` à `NULL`","Réinitialise à 0"], c:1, ex:"`free` **libère** l'espace mémoire alloué par `malloc`." },
  { id:84, ch:4, tp:"Allocation", q:"Différence `malloc` vs `calloc` :", o:["`calloc` est plus rapide","`calloc` initialise à 0","`malloc` prend 2 arguments","Aucune"], c:1, ex:"`calloc` alloue **et initialise à 0**." },
  { id:85, ch:4, tp:"Allocation", q:"Oublier `free` cause :", o:["Erreur de compilation","Fuite mémoire","Segfault","Rien"], c:1, ex:"**Fuite mémoire** : consommation RAM croissante." },
  { id:86, ch:4, tp:"Pointeurs", q:"Retourner l'adresse d'une variable locale ?", o:["OK","Dangling pointer (référence fantôme)","OK avec `static`","Seulement avec `malloc`"], c:1, ex:"→ pointeur **invalide** car la pile est dépilée au `return`." },
  { id:87, ch:4, tp:"Pointeurs", q:"`NULL` représente :", o:["L'adresse 0","Un pointeur vers rien","Erreur de compilation","Fin d'un tableau"], c:1, ex:"`NULL` = pointeur qui **ne pointe vers rien**." },
  { id:88, ch:4, tp:"Mémoire", q:"`static` pour une variable locale signifie :", o:["Constante","Persiste entre les appels","Sur le tas","Publique"], c:1, ex:"Variable `static` → **persiste** entre les appels de fonction." },

  { id:107, ch:2, tp:"Contrôle", q:"Les `goto` sont :", o:["Recommandés","Très fortement déconseillés","Obligatoires","Inexistants en C"], c:1, ex:"**Fortement déconseillés** (cf. Dijkstra, 1968)." },
  { id:108, ch:1, tp:"Types", q:"Que fait `(int) y` ?", o:["Supprime `y`","Force la conversion en `int`","Copie `y`","Vérifie le type"], c:1, ex:"**Cast explicite** : force la conversion de type." },
  { id:109, ch:4, tp:"Allocation", q:"`realloc` permet de :", o:["Réallouer avec une nouvelle taille","Libérer la mémoire","Allouer sur la pile","Compresser la mémoire"], c:0, ex:"`realloc` **redimensionne** une zone mémoire existante." },
  { id:110, ch:3, tp:"Codage", q:"Sur 8 bits, `255 + 1` vaut :", o:["256","0 (retenue disparaît)","-1","Erreur"], c:1, ex:"$11111111_2 + 1 = 100000000_2$, mais la retenue disparaît → **0**." },
];

const FICHES = [
  { ch:1, title:"Histoire du C", content:"**1969** — Unix par Thomson & Ritchie\n**1972** — Langage C par Dennis Ritchie\n**1978** — Sortie du K&R\n**1983** — Prix Turing pour Unix\n**1987** — GCC par Stallman\n**Normes** — K&R → C ANSI (1990) → C99 → C11 → C23" },
  { ch:1, title:"Syntaxe de base", content:"Instructions terminées par `;`\nBlocs délimités par `{ }`\nCommentaires `/* ... */` (C ANSI)\nBoucles : `while`, `do...while`, `for`\n`for(init; cond; incr)` = `while` avec init et incr\nConditionnels : `if` / `else if` / `else`" },
  { ch:1, title:"Types fondamentaux", content:"`char` (1o) · `short` (2o) · `int` (4o) · `long` (8o)\n`unsigned` : sans signe → $[0,\\ 2^n - 1]$\n`signed` : avec signe → $[-2^{n-1},\\ 2^{n-1} - 1]$\n`float` (4o) · `double` (8o) · `long double` (16o)\nPas de booléen : `0` = faux, tout le reste = vrai\nArithmétique **modulaire** pour les `unsigned`" },
  { ch:1, title:"printf — Formats", content:"`%d` entier décimal · `%u` unsigned · `%x` hexa · `%o` octal\n`%f` flottant · `%e` scientifique · `%g` le plus court\n`%c` caractère · `%s` chaîne · `%p` pointeur\n`%ld` long · `%hd` short\n`%.2f` → 2 décimales · `%10d` → largeur 10\n`%+d` affiche le signe · `%010d` padding avec des zéros" },
  { ch:1, title:"Fonctions", content:"`type_retour nom(type1 arg1, type2 arg2)`\nDéclarations au **DÉBUT** du bloc (C ANSI)\n`main()` retourne `int`, prend `void` ou `(int, char*[])`\n`return` quitte la fonction\nPassage par **valeur** : copie des arguments" },
  { ch:1, title:"Compilation", content:"`gcc fichier.c` → produit `a.out`\n`gcc -o nom fichier.c` → nomme l'exécutable\n`-Wall` tous les warnings · `-pedantic` mode pédant\n`-ansi` norme C ANSI · `-g` infos debug\n`./a.out` pour exécuter" },
  { ch:2, title:"Makefile", content:"`make` ne recompile que le **nécessaire**\nFichier nommé `Makefile` ou `makefile`\nRègle : `cible: dépendances` puis `↹commande`\n**TABULATIONS** obligatoires\n`make -B` tout reconstruire\n`$<` = source · `$@` = cible\nVariables : `CC = gcc` → `$(CC)`" },
  { ch:2, title:"Tableaux & Chaînes", content:"Taille **fixe**, typé, pas de `.length`\n`int tab[4];` ou `int tab[] = {1,2,3};`\nTaille connue à la compilation (sur la pile)\nChaîne = `char[]` terminé par `'\\0'`\n`char *s` non modifiable vs `char s[]` modifiable\nToujours **passer la longueur** aux fonctions" },
  { ch:2, title:"enum · struct · union · typedef", content:"`enum` : valeurs nommées (entiers à partir de 0)\n`struct` : regroupe plusieurs champs\n  → accès `var.champ` · passage par valeur = copie\n`union` : champs partagent la mémoire\n  → taille = max · un seul champ actif\n`typedef` : alias de type (cosmétique)" },
  { ch:2, title:"Contrôle avancé", content:"Ternaire : `cond ? e1 : e2`\n`switch/case` : aiguillage · `break` obligatoire !\n`default` optionnel\n`break` quitte la boucle · `continue` saute au début\n`goto` : **DÉCONSEILLÉ** (Dijkstra 1968)\n`exit(0)` quitte le programme" },
  { ch:2, title:"Opérations binaires", content:"`~` NOT · `&` AND · `|` OR · `^` XOR\n`<<` décalage gauche ($\\times 2^n$) · `>>` décalage droit ($\\div 2^n$)\n`1<<n` = $2^n$\n`~0` = tous les bits à 1\n`(1<<n) - 1` = $n$ bits à 1\nExemple : `3 & 5` = `0011 & 0101` = `0001` = 1" },
  { ch:3, title:"Codage mémoire", content:"Type = comment **interpréter** les bits\nLittle-endian (x86) : poids faible en premier\nBig-endian : poids fort en premier\nComplément à 2 : $-n = \\sim n + 1$\n$-1$ = tous les bits à 1\nIEEE 754 (`float`) : 1 signe + 8 exp + 23 mantisse\nFormule : $\\text{signe} \\times (1 + \\frac{m}{2^{23}}) \\times 2^{e-127}$\nAlignement : champ taille $n$ → adresse multiple de $n$" },
  { ch:4, title:"Pointeurs", content:"`int *p` : `p` pointe vers un `int`\n`&a` : adresse de `a` · `*p` : valeur pointée\n`p->champ` ≡ `(*p).champ`\nPassage par référence : `f(&x)`\n`NULL` : pointeur vers rien\n**JAMAIS** retourner `&variable_locale`" },
  { ch:4, title:"Pile · Tas · Allocation", content:"**STACK** : variables locales, taille fixe, automatique\n**HEAP** : allocation dynamique, géré par le dev\n`malloc(n)` alloue $n$ octets\n`calloc(nb, taille)` alloue + initialise à 0\n`realloc(ptr, taille)` redimensionne\n`free(ptr)` libère · Oubli → **fuite mémoire**" },
  { ch:4, title:"Pointeurs & Tableaux", content:"`tab[i]` ≡ `*(tab+i)`\nEn argument : `int tab[]` ≡ `int *tab`\n`sizeof(tableau)` = taille totale\n`sizeof(pointeur)` = 8 (64 bits)\nArithmétique : `p+1` avance de `sizeof(*p)`\nTableau = adresse fixe · Pointeur = modifiable" },
];

const CH = { 1:"Présentation du langage", 2:"Types & contrôle avancés", 3:"Codage & mémoire", 4:"Pointeurs & mémoire" };

// ── THEMES ───────────────────────────────────────────────────────────────────
const T = {
  light: { bg:"#f5f5f7", bg2:"#ffffff", tx:"#1d1d1f", tx2:"#6e6e73", tx3:"#aeaeb2", bd:"#e5e5ea", bd2:"#d1d1d6", card:"#ffffff", codeB:"#f2f2f7", codeT:"#1d1d1f", accent:"#007AFF", green:"#34C759", red:"#FF3B30", orange:"#FF9500", purple:"#AF52DE", teal:"#00C7BE", okBg:"#dcfce7", okBd:"#86efac", errBg:"#fef2f2", errBd:"#fca5a5", infoBg:"#eff6ff", infoBd:"#93c5fd", infoTx:"#1e40af", hlKw:"#9333ea", hlFn:"#2563eb", hlStr:"#16a34a", hlCom:"#9ca3af", hlNum:"#d97706", hlOp:"#dc2626", hlType:"#0891b2", hlPre:"#be185d" },
  dark:  { bg:"#000000", bg2:"#1c1c1e", tx:"#f5f5f7", tx2:"#98989d", tx3:"#48484a", bd:"#2c2c2e", bd2:"#3a3a3c", card:"#1c1c1e", codeB:"#161618", codeT:"#e5e5ea", accent:"#0a84ff", green:"#30d158", red:"#ff453a", orange:"#ff9f0a", purple:"#bf5af2", teal:"#63e6be", okBg:"#052e16", okBd:"#166534", errBg:"#2c0b0e", errBd:"#7f1d1d", infoBg:"#0c1929", infoBd:"#1e3a5f", infoTx:"#93c5fd", hlKw:"#c084fc", hlFn:"#60a5fa", hlStr:"#4ade80", hlCom:"#6b7280", hlNum:"#fbbf24", hlOp:"#f87171", hlType:"#22d3ee", hlPre:"#f472b6" }
};

// ── SYNTAX HIGHLIGHTING ──────────────────────────────────────────────────────
const C_KW = new Set(["if","else","for","while","do","return","break","continue","switch","case","default","goto","sizeof","typedef","struct","union","enum","static","void","const","extern","register","volatile"]);
const C_TYPE = new Set(["int","char","short","long","float","double","unsigned","signed","FILE","NULL","EOF","size_t"]);
const C_PRE = new Set(["#include","#define","#ifdef","#ifndef","#endif","#if","#else","#undef"]);

function tokenizeC(code, th) {
  const tokens = [];
  let i = 0;
  while (i < code.length) {
    // Comments
    if (code[i] === '/' && code[i+1] === '*') {
      let j = i + 2;
      while (j < code.length - 1 && !(code[j] === '*' && code[j+1] === '/')) j++;
      tokens.push({ text: code.slice(i, j+2), color: th.hlCom, style: "italic" });
      i = j + 2; continue;
    }
    if (code[i] === '/' && code[i+1] === '/') {
      let j = code.indexOf('\n', i);
      if (j === -1) j = code.length;
      tokens.push({ text: code.slice(i, j), color: th.hlCom, style: "italic" });
      i = j; continue;
    }
    // Strings
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i + 1;
      while (j < code.length && code[j] !== q) { if (code[j] === '\\') j++; j++; }
      tokens.push({ text: code.slice(i, j+1), color: th.hlStr });
      i = j + 1; continue;
    }
    // Preprocessor
    if (code[i] === '#') {
      let j = i;
      while (j < code.length && /[a-zA-Z#]/.test(code[j])) j++;
      const w = code.slice(i, j);
      tokens.push({ text: w, color: C_PRE.has(w) ? th.hlPre : th.hlOp, weight: "600" });
      i = j; continue;
    }
    // Numbers
    if (/[0-9]/.test(code[i]) && (i === 0 || !/[a-zA-Z_]/.test(code[i-1]))) {
      let j = i;
      if (code[j] === '0' && (code[j+1] === 'x' || code[j+1] === 'X')) { j += 2; while (j < code.length && /[0-9a-fA-F]/.test(code[j])) j++; }
      else { while (j < code.length && /[0-9.]/.test(code[j])) j++; }
      tokens.push({ text: code.slice(i, j), color: th.hlNum });
      i = j; continue;
    }
    // Words
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const w = code.slice(i, j);
      if (C_KW.has(w)) tokens.push({ text: w, color: th.hlKw, weight: "600" });
      else if (C_TYPE.has(w)) tokens.push({ text: w, color: th.hlType, weight: "600" });
      else if (j < code.length && code[j] === '(') tokens.push({ text: w, color: th.hlFn });
      else tokens.push({ text: w, color: th.codeT });
      i = j; continue;
    }
    // Operators
    if ("+-*/%=<>!&|^~?:".includes(code[i])) {
      tokens.push({ text: code[i], color: th.hlOp });
      i++; continue;
    }
    tokens.push({ text: code[i], color: th.codeT });
    i++;
  }
  return tokens;
}

function CodeBlock({ code, th }) {
  const tokens = useMemo(() => tokenizeC(code.trim(), th), [code, th]);
  return (
    <pre style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace", fontSize: 13, lineHeight: 1.65, padding: "14px 16px", borderRadius: 12, background: th.codeB, border: `1px solid ${th.bd}`, overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "8px 0" }}>
      <code>{tokens.map((t, i) => <span key={i} style={{ color: t.color, fontWeight: t.weight || "normal", fontStyle: t.style || "normal" }}>{t.text}</span>)}</code>
    </pre>
  );
}

// ── RICH TEXT RENDERER (Markdown-lite + LaTeX + Code) ─────────────────────────
function RichText({ text, th, size = 14, lh = 1.7 }) {
  if (!text) return null;
  const parts = text.split(/(\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <span style={{ fontSize: size, lineHeight: lh }}>
      {parts.map((p, i) => {
        if (p.startsWith("$") && p.endsWith("$")) {
          return <TeX key={i} expr={p.slice(1, -1)} th={th} />;
        }
        if (p.startsWith("`") && p.endsWith("`")) {
          return <code key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9em", padding: "2px 6px", borderRadius: 5, background: th.codeB, color: th.hlFn, border: `1px solid ${th.bd}`, whiteSpace: "nowrap" }}>{p.slice(1, -1)}</code>;
        }
        if (p.startsWith("**") && p.endsWith("**")) {
          return <strong key={i} style={{ fontWeight: 600, color: th.tx }}>{p.slice(2, -2)}</strong>;
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}

// ── LATEX RENDERER (subset) ──────────────────────────────────────────────────
function TeX({ expr, th }) {
  const rendered = useMemo(() => renderTeX(expr), [expr]);
  return <span style={{ fontFamily: "'Times New Roman', 'Georgia', serif", fontStyle: "italic", color: th.tx, fontSize: "1.05em", letterSpacing: 0.3 }} dangerouslySetInnerHTML={{ __html: rendered }} />;
}

function renderTeX(expr) {
  let s = expr
    .replace(/\\times/g, "×").replace(/\\cdot/g, "·").replace(/\\div/g, "÷")
    .replace(/\\leq/g, "≤").replace(/\\geq/g, "≥").replace(/\\neq/g, "≠")
    .replace(/\\sim/g, "~").replace(/\\bmod/g, " mod ")
    .replace(/\\text\{([^}]+)\}/g, '<span style="font-style:normal;font-family:inherit">$1</span>')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;font-size:0.85em;line-height:1.1"><span style="border-bottom:1px solid currentColor;padding:0 3px">$1</span><span style="padding:0 3px">$2</span></span>')
    .replace(/(\w)\^{([^}]+)}/g, '$1<sup style="font-size:0.75em;vertical-align:super">$2</sup>')
    .replace(/(\w)\^(\w)/g, '$1<sup style="font-size:0.75em;vertical-align:super">$2</sup>')
    .replace(/(\w)_\{([^}]+)\}/g, '$1<sub style="font-size:0.75em;vertical-align:sub">$2</sub>')
    .replace(/(\w)_(\w)/g, '$1<sub style="font-size:0.75em;vertical-align:sub">$2</sub>')
    .replace(/\\ /g, " ");
  return s;
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }
function toBin(n) { return ((n>>>0)&0xFF).toString(2).padStart(8,"0"); }
function cls(...args) { return args.filter(Boolean).join(" "); }

// ── SPRING ANIMATION HOOK ────────────────────────────────────────────────────
function useSpring(targetValue, config = { stiffness: 300, damping: 30 }) {
  const [value, setValue] = useState(targetValue);
  useEffect(() => { setValue(targetValue); }, [targetValue]);
  return value;
}

// ══════════════════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [dk, setDk] = useState(() => {
    try { const s = localStorage.getItem("c_dark"); if (s !== null) return s === "1"; } catch {}
    return window.matchMedia?.("(prefers-color-scheme:dark)").matches ?? false;
  });
  useEffect(() => { try { localStorage.setItem("c_dark", dk ? "1" : "0"); } catch {} }, [dk]);
  const [view, setView] = useState("home");
  const [cfg, setCfg] = useState(null);
  const [transition, setTransition] = useState(false);
  const th = dk ? T.dark : T.light;

  const navigate = (v, c) => {
    setTransition(true);
    setTimeout(() => { setView(v); if(c) setCfg(c); setTransition(false); }, 180);
  };

  return (
    <div style={{ background: th.bg, color: th.tx, minHeight: "100vh", transition: "background 0.4s ease, color 0.4s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; -webkit-text-size-adjust: 100%; background: ${th.bg}; }
        body { background: ${th.bg}; min-height: 100vh; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0}100%{background-position:200% 0} }
        @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.08)} }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: ${dk?"#333":"#c7c7cc"}; border-radius: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        button { cursor:pointer;border:none;outline:none;font-family:inherit;-webkit-tap-highlight-color:transparent;transition:all 0.2s cubic-bezier(0.25,0.46,0.45,0.94); }
        button:active { transform:scale(0.97) !important; }
        input:focus { outline: none; }
        @media (hover:hover) {
          .hov:hover { filter:brightness(0.96);transform:translateY(-1px); }
          .hovScale:hover { transform:scale(1.02); }
        }
        @media (max-width: 640px) {
          .gridModes { grid-template-columns: repeat(2, 1fr) !important; }
          .gridBits { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav th={th} dk={dk} setDk={setDk} view={view} navigate={navigate} />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 80px", opacity: transition ? 0 : 1, transform: transition ? "translateY(6px)" : "none", transition: "opacity 0.18s ease, transform 0.18s ease" }}>
        {view==="home"   && <Home th={th} dk={dk} navigate={navigate} />}
        {view==="quiz"   && <QuizView th={th} dk={dk} cfg={cfg} navigate={navigate} />}
        {view==="anki"   && <Anki th={th} dk={dk} navigate={navigate} />}
        {view==="errors" && <Errors th={th} dk={dk} navigate={navigate} />}
        {view==="bits"   && <Bits th={th} dk={dk} navigate={navigate} />}
        {view==="fiches" && <Fiches th={th} dk={dk} navigate={navigate} />}
      </main>
    </div>
  );
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ th, dk, setDk, view, navigate }) {
  return (
    <header style={{ position:"sticky", top:0, zIndex:100, height:48, display:"flex", alignItems:"center", borderBottom:`0.5px solid ${th.bd}`, background:dk?"rgba(0,0,0,0.82)":"rgba(245,245,247,0.82)", backdropFilter:"saturate(180%) blur(20px)", WebkitBackdropFilter:"saturate(180%) blur(20px)" }}>
      <div style={{ maxWidth:720, margin:"0 auto", width:"100%", padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={()=>navigate("home")} style={{ background:"none", display:"flex", alignItems:"center", gap:7, color:th.tx, padding:0 }}>
          <span style={{ fontSize:18, opacity:0.7 }}>⌘</span>
          <span style={{ fontSize:16, fontWeight:600, letterSpacing:-0.4 }}>C Mastery</span>
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {view !== "home" && <Pill onClick={()=>navigate("home")} th={th}>← Accueil</Pill>}
          <button onClick={()=>setDk(!dk)} style={{ width:34, height:34, borderRadius:17, display:"flex", alignItems:"center", justifyContent:"center", background:th.card, border:`0.5px solid ${th.bd}`, color:th.tx, fontSize:15, transition:"all 0.3s" }}>
            {dk ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}

function Pill({ onClick, th, children, active, color }) {
  return (
    <button className="hov" onClick={onClick} style={{ padding:"5px 12px", borderRadius:20, fontSize:13, fontWeight:500, background:active ? (color||th.accent) : th.card, color:active ? "#fff" : th.tx2, border:`0.5px solid ${active ? "transparent" : th.bd}` }}>{children}</button>
  );
}

// ── HOME ─────────────────────────────────────────────────────────────────────
function Home({ th, dk, navigate }) {
  const stats = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("c_stats")||'{"total":0,"correct":0}'); } catch { return {total:0,correct:0}; }
  }, []);
  const errCount = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("c_errors")||"[]").length; } catch { return 0; }
  }, []);
  const pct = stats.total > 0 ? Math.round((stats.correct/stats.total)*100) : 0;

  const modes = [
    { id:"quick", icon:"⚡", t:"QCM Rapide", d:"20 questions aléatoires", c:th.accent, go:()=>navigate("quiz",{mode:"random",count:20}) },
    { id:"chapter", icon:"📖", t:"Par Chapitre", d:"Sélectionner un cours", c:th.green, go:()=>navigate("quiz",{mode:"chapter"}) },
    { id:"full", icon:"🎯", t:"QCM Complet", d:`${Q.length} questions`, c:th.orange, go:()=>navigate("quiz",{mode:"full"}) },
    { id:"hard", icon:"🔥", t:"Mode Difficile", d:"Timer 15s, sans retour", c:th.red, go:()=>navigate("quiz",{mode:"hard",count:30}) },
    { id:"anki", icon:"🧠", t:"Répétition espacée", d:"Méthode Anki", c:th.purple, go:()=>navigate("anki") },
    { id:"errors", icon:"🔄", t:"Revoir les erreurs", d:`${errCount} question${errCount>1?"s":""} à revoir`, c:"#FF6B6B", go:()=>navigate("errors") },
    { id:"bits", icon:"💻", t:"Opérations binaires", d:"Entraînement bit à bit", c:"#5856D6", go:()=>navigate("bits") },
    { id:"fiches", icon:"📋", t:"Fiches de cours", d:`${FICHES.length} fiches de révision`, c:th.teal, go:()=>navigate("fiches") },
  ];

  return (
    <div style={{ animation:"fadeIn 0.5s ease" }}>
      {/* Hero */}
      <div style={{ textAlign:"center", padding:"44px 0 32px" }}>
        <h1 style={{ fontSize:"clamp(26px, 5vw, 36px)", fontWeight:700, letterSpacing:-1.2, lineHeight:1.15, marginBottom:8 }}>Programmation en C</h1>
        <p style={{ fontSize:16, color:th.tx2, fontWeight:400 }}>Cours d'Olivier Baldellon — UCA L2</p>

        {stats.total > 0 && (
          <div style={{ marginTop:24, display:"inline-flex", alignItems:"center", gap:14, padding:"10px 20px", borderRadius:16, background:th.card, border:`0.5px solid ${th.bd}`, animation:"scaleIn 0.4s ease" }}>
            <RingProgress pct={pct} size={42} stroke={4} color={pct>=70?th.green:pct>=40?th.orange:th.red} bg={th.bd} />
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:15, fontWeight:600 }}>{stats.correct}/{stats.total}</div>
              <div style={{ fontSize:12, color:th.tx3 }}>Score global</div>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="gridModes" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(165px, 1fr))", gap:10 }}>
        {modes.map((m,i) => (
          <button key={m.id} className="hov" onClick={m.go} style={{ padding:"18px 16px", borderRadius:14, background:th.card, border:`0.5px solid ${th.bd}`, textAlign:"left", position:"relative", animation:`fadeUp 0.45s ease ${i*0.04}s both`, overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2.5, background:m.c, opacity:0.6, borderRadius:"14px 14px 0 0" }} />
            <div style={{ fontSize:26, marginBottom:8 }}>{m.icon}</div>
            <div style={{ fontSize:14, fontWeight:600, color:th.tx, marginBottom:2, lineHeight:1.3 }}>{m.t}</div>
            <div style={{ fontSize:12, color:th.tx2, lineHeight:1.35 }}>{m.d}</div>
          </button>
        ))}
      </div>

      <p style={{ textAlign:"center", marginTop:44, fontSize:11, color:th.tx3, letterSpacing:0.2 }}>
        Conçu par Raphaël · {Q.length} questions · {FICHES.length} fiches
      </p>
    </div>
  );
}

function RingProgress({ pct, size, stroke, color, bg }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct/100)} strokeLinecap="round" style={{ transition:"stroke-dashoffset 0.8s ease" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" style={{ transform:"rotate(90deg)", transformOrigin:"center", fontSize:10, fontWeight:700, fill:color }}>{pct}%</text>
    </svg>
  );
}

// ── QUIZ ─────────────────────────────────────────────────────────────────────
function QuizView({ th, dk, cfg, navigate }) {
  const [ch, setCh] = useState(null);
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timer, setTimer] = useState(null);
  const timerRef = useRef(null);

  const needsCh = cfg?.mode === "chapter" && ch === null;

  useEffect(() => {
    if (cfg?.mode === "chapter" && ch !== null) setQs(shuffle(Q.filter(q=>q.ch===ch)));
    else if (cfg?.mode === "random") setQs(shuffle([...Q]).slice(0,cfg.count));
    else if (cfg?.mode === "full") setQs(shuffle([...Q]));
    else if (cfg?.mode === "hard") { setQs(shuffle([...Q]).slice(0,cfg.count||30)); setTimer(15); }
  }, [cfg, ch]);

  useEffect(() => {
    if (cfg?.mode==="hard" && timer!==null && !show && !done) {
      if (timer<=0) { pick(-1); return; }
      timerRef.current = setTimeout(()=>setTimer(t=>t-1), 1000);
      return ()=>clearTimeout(timerRef.current);
    }
  }, [timer, show, done]);

  const pick = (optIdx) => {
    if (show) return;
    const q = qs[idx]; const ok = optIdx === q.c;
    setSel(optIdx); setShow(true);
    if (ok) setScore(s=>s+1);
    try {
      const errs = JSON.parse(localStorage.getItem("c_errors")||"[]");
      if (!ok && !errs.includes(q.id)) localStorage.setItem("c_errors", JSON.stringify([...errs, q.id]));
      else if (ok) localStorage.setItem("c_errors", JSON.stringify(errs.filter(id=>id!==q.id)));
      const st = JSON.parse(localStorage.getItem("c_stats")||'{"total":0,"correct":0}');
      st.total++; if(ok) st.correct++; localStorage.setItem("c_stats", JSON.stringify(st));
    } catch{}
  };

  const next = () => {
    if (idx+1>=qs.length) { setDone(true); return; }
    setIdx(i=>i+1); setSel(null); setShow(false);
    if (cfg?.mode==="hard") setTimer(15);
  };

  if (needsCh) return (
    <div style={{ paddingTop:28, animation:"fadeIn 0.3s" }}>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:18, letterSpacing:-0.5 }}>Choisir un chapitre</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {Object.entries(CH).map(([c,name])=>{
          const cnt = Q.filter(q=>q.ch===Number(c)).length;
          return (
            <button key={c} className="hov" onClick={()=>setCh(Number(c))} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderRadius:12, background:th.card, border:`0.5px solid ${th.bd}`, color:th.tx, textAlign:"left" }}>
              <span style={{ fontSize:12, fontWeight:700, color:th.accent, fontVariantNumeric:"tabular-nums", minWidth:18 }}>{c}</span>
              <span style={{ fontWeight:500, flex:1 }}>{name}</span>
              <span style={{ fontSize:12, color:th.tx3 }}>{cnt}q</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!qs.length) return <div style={{ textAlign:"center", paddingTop:60, color:th.tx2 }}>Chargement…</div>;

  if (done) {
    const p = Math.round((score/qs.length)*100);
    return (
      <div style={{ textAlign:"center", paddingTop:50, animation:"scaleIn 0.4s" }}>
        <div style={{ fontSize:56, marginBottom:12 }}>{p>=80?"🎉":p>=50?"💪":"📚"}</div>
        <h2 style={{ fontSize:26, fontWeight:700, marginBottom:6, letterSpacing:-0.5 }}>Terminé !</h2>
        <p style={{ fontSize:44, fontWeight:700, color:p>=70?th.green:p>=40?th.orange:th.red }}>{p}%</p>
        <p style={{ fontSize:16, color:th.tx2, marginBottom:28 }}>{score}/{qs.length} bonnes réponses</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <Btn onClick={()=>navigate("home")} th={th}>Accueil</Btn>
          <Btn onClick={()=>{setIdx(0);setScore(0);setDone(false);setSel(null);setShow(false);setQs(shuffle([...qs]));if(cfg?.mode==="hard")setTimer(15);}} th={th} primary>Recommencer</Btn>
        </div>
      </div>
    );
  }

  const q = qs[idx]; const prog = ((idx+1)/qs.length)*100;

  return (
    <div style={{ paddingTop:20, animation:"fadeIn 0.25s" }}>
      {/* Progress bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:12, color:th.tx3, fontWeight:500, fontVariantNumeric:"tabular-nums" }}>{idx+1} / {qs.length}</span>
        {cfg?.mode==="hard" && timer!==null && (
          <span style={{ fontSize:14, fontWeight:700, fontVariantNumeric:"tabular-nums", color:timer<=5?th.red:th.tx, animation:timer<=5?"pulse 0.5s infinite":"none" }}>⏱ {timer}s</span>
        )}
        <span style={{ fontSize:11, color:th.tx3 }}>Ch.{q.ch} · {q.tp}</span>
      </div>
      <div style={{ height:2.5, borderRadius:2, background:th.bd, marginBottom:24, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:2, background:th.accent, width:`${prog}%`, transition:"width 0.35s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
      </div>

      {/* Question */}
      <div style={{ fontSize:"clamp(17px, 4vw, 20px)", fontWeight:600, lineHeight:1.45, marginBottom:22, letterSpacing:-0.3 }}>
        <RichText text={q.q} th={th} size="inherit" lh={1.45} />
      </div>

      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {q.o.map((opt,i) => {
          const isCorrect = i===q.c;
          const isSelected = i===sel;
          let bg=th.card, bd=th.bd, tx=th.tx;
          if (show) {
            if (isCorrect) { bg=th.okBg; bd=th.okBd; tx=th.green; }
            else if (isSelected) { bg=th.errBg; bd=th.errBd; tx=th.red; }
          }
          return (
            <button key={i} className={!show?"hov":""} onClick={()=>pick(i)} disabled={show} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:12, background:bg, border:`1.5px solid ${bd}`, color:tx, fontSize:15, textAlign:"left", opacity:show&&!isCorrect&&!isSelected?0.45:1, transition:"all 0.25s ease" }}>
              <span style={{ width:26, height:26, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, flexShrink:0, background:show&&isCorrect?th.green:show&&isSelected?th.red:dk?"#2a2a2c":"#f0f0f5", color:show&&(isCorrect||isSelected)?"#fff":th.tx2, transition:"all 0.2s" }}>
                {show && isCorrect ? "✓" : show && isSelected ? "✗" : String.fromCharCode(65+i)}
              </span>
              <RichText text={opt} th={{...th, tx}} size={15} />
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {show && (
        <div style={{ marginTop:14, padding:"14px 16px", borderRadius:12, background:th.infoBg, border:`1px solid ${th.infoBd}`, animation:"fadeUp 0.3s ease" }}>
          <div style={{ color:th.infoTx, lineHeight:1.6 }}>
            <RichText text={q.ex} th={{...th, tx:th.infoTx}} size={14} />
          </div>
          <button className="hov" onClick={next} style={{ marginTop:12, padding:"9px 18px", borderRadius:10, background:th.accent, color:"#fff", fontSize:14, fontWeight:600 }}>
            {idx+1>=qs.length ? "Voir les résultats" : "Suivant →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── ANKI ─────────────────────────────────────────────────────────────────────
function Anki({ th, dk, navigate }) {
  const [deck, setDeck] = useState(() => {
    try { const s=JSON.parse(localStorage.getItem("c_anki")); if(s?.length===Q.length) return s; } catch{}
    return Q.map(q=>({...q,box:0,nr:Date.now()}));
  });
  const [cur, setCur] = useState(null);
  const [show, setShow] = useState(false);
  const [sel, setSel] = useState(null);
  const [sC, setSC] = useState(0);
  const [sOk, setSOk] = useState(0);

  useEffect(()=>{ try{localStorage.setItem("c_anki",JSON.stringify(deck))}catch{} },[deck]);

  const due = deck.filter(c=>c.nr<=Date.now());
  const pickCard = useCallback(()=>{
    const d=deck.filter(c=>c.nr<=Date.now());
    if(!d.length){setCur(null);return;}
    d.sort((a,b)=>a.box-b.box);
    setCur(d[Math.floor(Math.random()*Math.min(5,d.length))]);
    setShow(false); setSel(null);
  },[deck]);

  useEffect(()=>{ pickCard(); },[]);

  const rate = (quality) => {
    if(!cur) return;
    const iv=[30e3,12e4,6e5,36e5,864e5,2592e5];
    const nb = quality==="again"?0:quality==="hard"?Math.max(0,cur.box):quality==="good"?Math.min(5,cur.box+1):Math.min(5,cur.box+2);
    setDeck(d=>d.map(c=>c.id===cur.id?{...c,box:nb,nr:Date.now()+iv[nb]}:c));
    setSC(c=>c+1); if(quality!=="again") setSOk(c=>c+1);
    setTimeout(pickCard, 150);
  };

  const answer = (i) => { if(show) return; setSel(i); setShow(true); };

  const boxCts = [0,1,2,3,4,5].map(b=>deck.filter(c=>c.box===b).length);

  if (!cur) return (
    <div style={{ textAlign:"center", paddingTop:60, animation:"fadeIn 0.3s" }}>
      <div style={{ fontSize:48, marginBottom:14 }}>🎉</div>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Toutes les cartes révisées !</h2>
      <p style={{ color:th.tx2, marginBottom:22 }}>Revenez plus tard pour continuer.</p>
      <Btn onClick={()=>navigate("home")} th={th} primary>Accueil</Btn>
    </div>
  );

  return (
    <div style={{ paddingTop:22, animation:"fadeIn 0.3s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ fontSize:20, fontWeight:700, letterSpacing:-0.4 }}>🧠 Répétition espacée</h2>
        <div style={{ display:"flex", gap:3 }}>
          {boxCts.map((c,i)=>(
            <div key={i} title={`Boîte ${i}: ${c}`} style={{ width:22, height:22, borderRadius:6, background:i<=1?th.red:i<=3?th.orange:th.green, opacity:0.15+Math.min(c/Q.length,0.85)*0.85, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#fff" }}>{c}</div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:16, marginBottom:18, fontSize:12, color:th.tx2 }}>
        <span>📥 {due.length} à revoir</span>
        <span>✅ {sOk}/{sC} session</span>
        <span>📦 Boîte {cur.box}/5</span>
      </div>

      <Card th={th} dk={dk}>
        <div style={{ fontSize:11, color:th.tx3, marginBottom:10, fontWeight:500, textTransform:"uppercase", letterSpacing:0.5 }}>Ch.{cur.ch} · {cur.tp}</div>
        <div style={{ fontSize:17, fontWeight:600, lineHeight:1.45, marginBottom:18 }}>
          <RichText text={cur.q} th={th} size={17} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {cur.o.map((opt,i) => {
            const ok=i===cur.c, isSel=i===sel;
            let bg=dk?"#2a2a2c":"#f5f5f7", bd="transparent";
            if(show){ if(ok){bg=th.okBg;bd=th.okBd;} else if(isSel){bg=th.errBg;bd=th.errBd;} }
            return (
              <button key={i} onClick={()=>answer(i)} disabled={show} style={{ padding:"10px 13px", borderRadius:10, background:bg, border:`1.5px solid ${bd}`, color:th.tx, fontSize:14, textAlign:"left", transition:"all 0.2s" }}>
                <RichText text={opt} th={th} size={14} />
              </button>
            );
          })}
        </div>
      </Card>

      {show && (
        <div style={{ animation:"fadeUp 0.25s ease" }}>
          <div style={{ margin:"12px 0", padding:"12px 14px", borderRadius:10, background:th.infoBg, border:`1px solid ${th.infoBd}` }}>
            <RichText text={cur.ex} th={{...th,tx:th.infoTx}} size={13} />
          </div>
          <p style={{ fontSize:12, color:th.tx2, marginBottom:8, textAlign:"center" }}>Auto-évaluation</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
            {[{l:"À revoir",k:"again",c:th.red},{l:"Difficile",k:"hard",c:th.orange},{l:"Bien",k:"good",c:th.green},{l:"Facile",k:"easy",c:th.accent}].map(b=>(
              <button key={b.k} className="hov" onClick={()=>rate(b.k)} style={{ padding:"11px 6px", borderRadius:10, background:b.c, color:"#fff", fontSize:12, fontWeight:600 }}>{b.l}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ERRORS ───────────────────────────────────────────────────────────────────
function Errors({ th, dk, navigate }) {
  const [errIds, setErrIds] = useState(()=>{ try{return JSON.parse(localStorage.getItem("c_errors")||"[]")}catch{return[]} });
  const errQs = useMemo(()=>Q.filter(q=>errIds.includes(q.id)),[errIds]);
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState(false);

  if(!errQs.length) return (
    <div style={{ textAlign:"center", paddingTop:60, animation:"fadeIn 0.3s" }}>
      <div style={{ fontSize:48, marginBottom:14 }}>✨</div>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Aucune erreur à revoir !</h2>
      <p style={{ color:th.tx2, marginBottom:22 }}>Continuez à vous entraîner.</p>
      <Btn onClick={()=>navigate("home")} th={th} primary>Accueil</Btn>
    </div>
  );

  if(idx>=errQs.length) return (
    <div style={{ textAlign:"center", paddingTop:60, animation:"scaleIn 0.3s" }}>
      <div style={{ fontSize:48, marginBottom:14 }}>🔄</div>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Révision terminée !</h2>
      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <Btn onClick={()=>navigate("home")} th={th}>Accueil</Btn>
        <Btn onClick={()=>{setIdx(0);setSel(null);setShow(false);setErrIds(JSON.parse(localStorage.getItem("c_errors")||"[]"));}} th={th} primary>Recommencer</Btn>
      </div>
    </div>
  );

  const q = errQs[idx];
  const pick = (i)=>{
    if(show) return; setSel(i); setShow(true);
    if(i===q.c){const ne=errIds.filter(id=>id!==q.id);setErrIds(ne);try{localStorage.setItem("c_errors",JSON.stringify(ne))}catch{}}
  };

  return (
    <div style={{ paddingTop:22, animation:"fadeIn 0.3s" }}>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4, letterSpacing:-0.4 }}>🔄 Revoir les erreurs</h2>
      <div style={{ fontSize:12, color:th.tx2, marginBottom:18 }}>{idx+1}/{errQs.length} · Ch.{q.ch} · {q.tp}</div>
      <div style={{ fontSize:17, fontWeight:600, lineHeight:1.45, marginBottom:18 }}><RichText text={q.q} th={th} size={17} /></div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {q.o.map((opt,i)=>{
          let bg=th.card, bd=th.bd;
          if(show){if(i===q.c){bg=th.okBg;bd=th.okBd;}else if(i===sel){bg=th.errBg;bd=th.errBd;}}
          return <button key={i} className={!show?"hov":""} onClick={()=>pick(i)} disabled={show} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:12, background:bg, border:`1.5px solid ${bd}`, color:th.tx, fontSize:15, textAlign:"left" }}>
            <span style={{ width:26,height:26,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0,background:show&&i===q.c?th.green:show&&i===sel?th.red:dk?"#2a2a2c":"#f0f0f5",color:show&&(i===q.c||i===sel)?"#fff":th.tx2 }}>{show&&i===q.c?"✓":show&&i===sel?"✗":String.fromCharCode(65+i)}</span>
            <RichText text={opt} th={th} size={15} />
          </button>;
        })}
      </div>
      {show && (
        <div style={{ marginTop:14, padding:"14px 16px", borderRadius:12, background:th.infoBg, border:`1px solid ${th.infoBd}`, animation:"fadeUp 0.25s" }}>
          <RichText text={q.ex} th={{...th,tx:th.infoTx}} size={14} />
          <button className="hov" onClick={()=>{setIdx(i=>i+1);setSel(null);setShow(false);}} style={{ marginTop:10, padding:"9px 18px", borderRadius:10, background:th.accent, color:"#fff", fontSize:14, fontWeight:600 }}>Suivant →</button>
        </div>
      )}
    </div>
  );
}

// ── BITS TRAINER ─────────────────────────────────────────────────────────────
function Bits({ th, dk, navigate }) {
  const [mode, setMode] = useState(null);
  const [prob, setProb] = useState(null);
  const [ans, setAns] = useState("");
  const [fb, setFb] = useState(null);
  const [streak, setStreak] = useState(0);
  const inputRef = useRef(null);

  const gen = useCallback((m)=>{
    if(m==="ops"){
      const ops=["&","|","^","<<",">>","~"];
      const op=ops[Math.floor(Math.random()*ops.length)];
      const a=Math.floor(Math.random()*256);
      const b=op==="~"?0:op==="<<"||op===">>"?Math.floor(Math.random()*5)+1:Math.floor(Math.random()*256);
      let r; switch(op){case"&":r=a&b;break;case"|":r=a|b;break;case"^":r=a^b;break;case"<<":r=(a<<b)&0xFF;break;case">>":r=a>>b;break;case"~":r=(~a)&0xFF;break;}
      setProb({display:op==="~"?`~${a}`:`${a} ${op} ${b}`,bin:op==="~"?`~${toBin(a)}`:`${toBin(a)} ${op} ${op==="<<"||op===">>"?b:toBin(b)}`,result:String(r&0xFF),resBin:toBin(r&0xFF),hint:"Répondez en décimal"});
    }else if(m==="convert"){
      const n=Math.floor(Math.random()*256);
      if(Math.random()>0.5) setProb({display:`Convertir **${n}** en binaire (8 bits)`,result:toBin(n),hint:"8 bits, ex: 01010011"});
      else setProb({display:`Convertir **${toBin(n)}**₂ en décimal`,result:String(n),hint:"Répondez en décimal"});
    }else if(m==="complement"){
      const n=Math.floor(Math.random()*128)+1;
      const neg=(~n+1)&0xFF;
      setProb({display:`Complément à 2 de **${n}** sur 8 bits ?`,result:String(neg),resBin:toBin(neg),hint:"Répondez en décimal (0-255)"});
    }else if(m==="hex"){
      const n=Math.floor(Math.random()*256);
      if(Math.random()>0.5) setProb({display:`Convertir **${n}** en hexadécimal`,result:n.toString(16).toUpperCase(),hint:"Ex: FF, A3…"});
      else { const h=n.toString(16).toUpperCase(); setProb({display:`Convertir **0x${h}** en décimal`,result:String(n),hint:"Répondez en décimal"}); }
    }
    setAns(""); setFb(null);
    setTimeout(()=>inputRef.current?.focus(), 100);
  },[]);

  const check = () => {
    if(!prob||!ans.trim()) return;
    const u=ans.trim().toUpperCase().replace(/^0[BX]/,"");
    const ok=u===prob.result.toUpperCase();
    setFb({ok,expected:prob.result,resBin:prob.resBin});
    setStreak(s=>ok?s+1:0);
  };

  if(!mode) return (
    <div style={{ paddingTop:28, animation:"fadeIn 0.3s" }}>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:18, letterSpacing:-0.5 }}>💻 Opérations binaires</h2>
      <div className="gridBits" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {[{id:"ops",icon:"⚙️",t:"Bit à bit",d:"`&` `|` `^` `~` `<<` `>>`"},
          {id:"convert",icon:"🔄",t:"Base 2",d:"Décimal ↔ Binaire"},
          {id:"complement",icon:"➖",t:"Complément à 2",d:"$-n = \\sim n + 1$"},
          {id:"hex",icon:"🔢",t:"Hexadécimal",d:"Décimal ↔ Hexa"}
        ].map(m=>(
          <button key={m.id} className="hov" onClick={()=>{setMode(m.id);gen(m.id);}} style={{ padding:"18px 16px", borderRadius:14, background:th.card, border:`0.5px solid ${th.bd}`, textAlign:"left" }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{m.icon}</div>
            <div style={{ fontSize:14, fontWeight:600, color:th.tx, marginBottom:2 }}>{m.t}</div>
            <div style={{ fontSize:12, color:th.tx2 }}><RichText text={m.d} th={th} size={12} /></div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop:22, animation:"fadeIn 0.3s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <Pill onClick={()=>setMode(null)} th={th}>← Modes</Pill>
        <span style={{ fontSize:13, fontWeight:600, color:streak>=5?th.green:th.tx }}>🔥 {streak}</span>
      </div>
      {prob && (
        <Card th={th} dk={dk}>
          <div style={{ fontSize:18, fontWeight:600, marginBottom:4, lineHeight:1.45 }}>
            <RichText text={prob.display} th={th} size={18} />
          </div>
          {prob.bin && <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:th.tx2, marginBottom:4 }}>{prob.bin}</div>}
          {prob.hint && <div style={{ fontSize:11, color:th.tx3, marginBottom:14 }}>{prob.hint}</div>}
          <div style={{ display:"flex", gap:8 }}>
            <input ref={inputRef} value={ans} onChange={e=>setAns(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()} placeholder="…" style={{ flex:1, padding:"11px 14px", borderRadius:10, border:`1.5px solid ${th.bd}`, background:dk?"#111":"#fafafa", color:th.tx, fontSize:16, fontFamily:"'JetBrains Mono',monospace" }} autoFocus />
            <button className="hov" onClick={check} style={{ padding:"11px 18px", borderRadius:10, background:th.accent, color:"#fff", fontWeight:700, fontSize:16 }}>✓</button>
          </div>
          {fb && (
            <div style={{ marginTop:14, padding:"12px 14px", borderRadius:10, background:fb.ok?th.okBg:th.errBg, border:`1px solid ${fb.ok?th.okBd:th.errBd}`, animation:"fadeUp 0.2s" }}>
              <p style={{ fontWeight:600, fontSize:14, color:fb.ok?th.green:th.red, marginBottom:2 }}>{fb.ok?"Correct !":` Réponse : ${fb.expected}`}</p>
              {fb.resBin && <p style={{ fontSize:12, fontFamily:"'JetBrains Mono',monospace", color:th.tx2 }}>{fb.resBin}₂</p>}
              <button className="hov" onClick={()=>gen(mode)} style={{ marginTop:10, padding:"8px 16px", borderRadius:8, background:th.accent, color:"#fff", fontSize:13, fontWeight:600 }}>Suivant →</button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ── FICHES ───────────────────────────────────────────────────────────────────
function Fiches({ th, dk, navigate }) {
  const [ch, setCh] = useState(null);
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);

  if(ch===null) return (
    <div style={{ paddingTop:28, animation:"fadeIn 0.3s" }}>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:18, letterSpacing:-0.5 }}>📋 Fiches de cours</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <button className="hov" onClick={()=>{setCh(-1);setIdx(0);}} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderRadius:12, background:th.card, border:`0.5px solid ${th.bd}`, color:th.tx, textAlign:"left" }}>
          <span style={{ fontSize:16 }}>📚</span>
          <span style={{ fontWeight:600, flex:1 }}>Toutes les fiches</span>
          <span style={{ fontSize:12, color:th.tx3 }}>{FICHES.length}</span>
        </button>
        {Object.entries(CH).map(([c,name])=>{
          const cnt=FICHES.filter(f=>f.ch===Number(c)).length;
          return (
            <button key={c} className="hov" onClick={()=>{setCh(Number(c));setIdx(0);}} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderRadius:12, background:th.card, border:`0.5px solid ${th.bd}`, color:th.tx, textAlign:"left" }}>
              <span style={{ fontSize:12, fontWeight:700, color:th.accent, minWidth:18 }}>{c}</span>
              <span style={{ fontWeight:500, flex:1 }}>{name}</span>
              <span style={{ fontSize:12, color:th.tx3 }}>{cnt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const fiches = ch===-1 ? FICHES : FICHES.filter(f=>f.ch===ch);
  const f = fiches[idx];

  const goTo = (dir) => {
    setFlip(true);
    setTimeout(()=>{
      setIdx(i=>i+dir);
      setFlip(false);
    }, 150);
  };

  return (
    <div style={{ paddingTop:22, animation:"fadeIn 0.3s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <Pill onClick={()=>setCh(null)} th={th}>← Chapitres</Pill>
        <span style={{ fontSize:12, color:th.tx3, fontVariantNumeric:"tabular-nums" }}>{idx+1} / {fiches.length}</span>
      </div>

      <div style={{ opacity:flip?0:1, transform:flip?"scale(0.97) translateY(4px)":"none", transition:"all 0.15s ease" }}>
        <Card th={th} dk={dk} style={{ minHeight:280 }}>
          <div style={{ fontSize:11, color:th.tx3, marginBottom:6, fontWeight:500, textTransform:"uppercase", letterSpacing:0.6 }}>
            Cours {f.ch} — {CH[f.ch]}
          </div>
          <h3 style={{ fontSize:21, fontWeight:700, marginBottom:18, letterSpacing:-0.5 }}>{f.title}</h3>
          <FicheContent content={f.content} th={th} />
        </Card>
      </div>

      {/* Nav dots */}
      <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:16, marginBottom:12, flexWrap:"wrap" }}>
        {fiches.map((_,i)=>(
          <button key={i} onClick={()=>{setFlip(true);setTimeout(()=>{setIdx(i);setFlip(false);},150);}} style={{ width:i===idx?18:6, height:6, borderRadius:3, background:i===idx?th.accent:th.bd, border:"none", transition:"all 0.3s ease", padding:0 }} />
        ))}
      </div>

      <div style={{ display:"flex", justifyContent:"center", gap:10 }}>
        <Btn onClick={()=>goTo(-1)} th={th} disabled={idx===0}>← Précédent</Btn>
        <Btn onClick={()=>goTo(1)} th={th} primary disabled={idx>=fiches.length-1}>Suivant →</Btn>
      </div>
    </div>
  );
}

function FicheContent({ content, th }) {
  const lines = content.split("\n");
  return (
    <div style={{ fontSize:14, lineHeight:1.75, color:th.tx2 }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height:8 }} />;
        const indent = line.startsWith("  ");
        return (
          <div key={i} style={{ paddingLeft:indent?16:0, marginBottom:3, animation:`slideIn 0.3s ease ${i*0.02}s both` }}>
            {indent && <span style={{ color:th.tx3, marginRight:6, fontSize:10 }}>›</span>}
            <RichText text={trimmed} th={th} size={14} lh={1.75} />
          </div>
        );
      })}
    </div>
  );
}

// ── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Card({ th, dk, children, style={} }) {
  return (
    <div style={{ padding:"22px 20px", borderRadius:16, background:th.card, border:`0.5px solid ${th.bd}`, ...style }}>
      {children}
    </div>
  );
}

function Btn({ onClick, th, children, primary, disabled }) {
  return (
    <button className={disabled?"":"hov"} onClick={onClick} disabled={disabled} style={{ padding:"10px 20px", borderRadius:10, fontSize:14, fontWeight:600, background:primary?th.accent:th.card, color:primary?"#fff":th.tx, border:primary?"none":`0.5px solid ${th.bd}`, opacity:disabled?0.4:1, pointerEvents:disabled?"none":"auto" }}>
      {children}
    </button>
  );
}
