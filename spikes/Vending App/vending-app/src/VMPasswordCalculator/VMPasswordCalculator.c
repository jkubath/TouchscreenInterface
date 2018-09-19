#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char decToHex(int);
int hexToDec(char);
char *addHex(char *, char *);
char *modHex(char *, char *);
char *setLengthOfHex(char *, int);
int compareHex(char *, char *);

char decToHex(int decimal) {
  switch(decimal) {
    case 0:
      return '0';
    case 1:
      return '1';
    case 2:
      return '2';
    case 3:
      return '3';
    case 4:
      return '4';
    case 5:
      return '5';
    case 6:
      return '6';
    case 7:
      return '7';
    case 8:
      return '8';
    case 9:
      return '9';
    case 10:
      return 'A';
    case 11:
      return 'B';
    case 12:
      return 'C';
    case 13:
      return 'D';
    case 14:
      return 'E';
    case 15:
      return 'F';
  }
  return '\0';
}

int hexToDec(char hexadecimal) {
  switch(hexadecimal) {
    case '0':
      return 0;
    case '1':
      return 1;
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
    case '6':
      return 6;
    case '7':
      return 7;
    case '8':
      return 8;
    case '9':
      return 9;
    case 'A':
      return 10;
    case 'B':
      return 11;
    case 'C':
      return 12;
    case 'D':
      return 13;
    case 'E':
      return 14;
    case 'F':
      return 15;
  }
  return -1;
}

char *addHex(char *hexA, char *hexB) {
  if (strlen(hexA) < strlen(hexB)) {
    hexA = setLengthOfHex(hexA, strlen(hexB));
  } else if (strlen(hexB) < strlen(hexA)) {
    hexB = setLengthOfHex(hexB, strlen(hexA));
  }

  char *answer = calloc(strlen(hexA) + 2, sizeof(char));

  int carry = 0;
  int currentPosition = (int)(strlen(hexA));
  for (int i = strlen(hexA) - 1; i >= 0; i--) {
    int decA = hexToDec(hexA[i]);
    int decB = hexToDec(hexB[i]);
    int sum = decA + decB + carry;
    answer[currentPosition] = decToHex(sum % 16);
    currentPosition--;

    if (sum >= 16) {
      carry = 1;
    } else {
      carry = 0;
    }
  }

  if (carry == 1) {
    answer[currentPosition] = '1';
  } else {
    answer[currentPosition] = '0';
  }

  return answer;
}


char *subtractHex(char *hexA, char *hexB) {
  if (strlen(hexA) < strlen(hexB)) {
    hexA = setLengthOfHex(hexA, strlen(hexB));
  } else if (strlen(hexB) < strlen(hexA)) {
    hexB = setLengthOfHex(hexB, strlen(hexA));
  }

  char *answer = calloc((int)strlen(hexA) + 1, sizeof(char));

  int currentPosition = (int)(strlen(hexA) - 1);
  for (int i = strlen(hexA) - 1; i >= 0; i--) {
    int decA = hexToDec(hexA[i]);
    int decB = hexToDec(hexB[i]);

    if (decA >= decB) {
      int difference = decA - decB;
      answer[currentPosition] = decToHex(difference);
      currentPosition--;
    } else {
      int j = i - 1;
      while (hexToDec(hexA[j]) == 0) {
        j--;
      }

      char *newHex = calloc(strlen(hexA) + 1, sizeof(char));
      char *changedCharacter = calloc(2, sizeof(char));
      changedCharacter[0] = decToHex(hexToDec(hexA[j]) - 1);

      strncpy(newHex, hexA, j);
      strncpy(newHex + j, changedCharacter, 1);
      strncpy(newHex + j + 1, hexA + j + 1, strlen(hexA) - j - 1);
      hexA = calloc(strlen(newHex) + 1, sizeof(char));
      strncpy(hexA, newHex, strlen(newHex) + 1);

      free(newHex);
      free(changedCharacter);
      j++;
      while (j < i) {
        char *newHex = calloc(strlen(hexA) + 1, sizeof(char));
        strncpy(newHex, hexA, j);
        strncpy(newHex + j, "F", 1);
        strncpy(newHex + j + 1, hexA + j + 1, strlen(hexA) - j - 1);
        hexA = calloc(strlen(newHex) + 1, sizeof(char));
        strncpy(hexA, newHex, strlen(newHex) + 1);
        free(newHex);
        j++;
      }

      int difference = (decA + 16) - decB;

      answer[currentPosition] = decToHex(difference);
      currentPosition--;
    }
  }

  return answer;
}



char *multiplyHex(char *hexA, char *hexB) {
  char *myHexA = calloc(strlen(hexA) + 1, sizeof(char));
  strncpy(myHexA, hexA, strlen(hexA) + 1);
  char *product = calloc((int)strlen(hexA) + (int)strlen(hexB) + 1, sizeof(char));
  for (int i = 0; i < ((int)strlen(hexA) + (int)strlen(hexB)); i++) {
    product[i] = '0';
  }

  for (int i = strlen(hexB) - 1; i >= 0; i--) {
    for (int j = 0; j < hexToDec(hexB[i]); j++) {
      product = addHex(product, myHexA);
    }

    char *myHexACopy = calloc((int)(strlen(myHexA) + 2), sizeof(char));
    for (int j = 0; j < strlen(myHexA); j++) {
      myHexACopy[j] = myHexA[j];
    }
    myHexACopy[(int)(strlen(myHexA))] = '0';
    free(myHexA);
    myHexA = calloc((int)(strlen(myHexACopy)) + 1, sizeof(char));
    strncpy(myHexA, myHexACopy, strlen(myHexACopy) + 1);
    free(myHexACopy);
  }

  return product;
}



char *modHex(char *hexA, char *hexB) {
  while (compareHex(hexA, hexB) >= 0) {
    char *hexBCopy1 = calloc(strlen(hexB) + 1, sizeof(char));
    char *hexBCopy2 = calloc(strlen(hexB) + 1, sizeof(char));
    strncpy(hexBCopy1, hexB, strlen(hexB));
    strncpy(hexBCopy2, hexB, strlen(hexB));

    while (compareHex(hexA, hexBCopy1) == 1) {
      hexBCopy1 = setLengthOfHex(hexBCopy1, strlen(hexBCopy1) + 1);
      for (int i = 1; i < strlen(hexBCopy1); i++) {
        hexBCopy1[i - 1] = hexBCopy1[i];
      }
      hexBCopy1[strlen(hexBCopy1) - 1] = '0';
      if (compareHex(hexA, hexBCopy1) >= 0) {
        hexBCopy2 = setLengthOfHex(hexBCopy2, strlen(hexBCopy2) + 1);
        for (int i = 1; i < strlen(hexBCopy2); i++) {
          hexBCopy2[i - 1] = hexBCopy2[i];
        }
        hexBCopy2[strlen(hexBCopy2) - 1] = '0';
      }
    }
    hexA = subtractHex(hexA, hexBCopy2);
  }

  return hexA;
}


char *setLengthOfHex(char *hex, int length) {
  if (strlen(hex) < length) {
    char *newHex = calloc(length + 1, sizeof(char));
    for (int i = 0; i < length - strlen(hex); i++) {
      newHex[i] = '0';
    }
    for (int i = length - strlen(hex); i < length; i++) {
      newHex[i] = hex[i - (length - strlen(hex))];
    }
    hex = newHex;
  } else if (strlen(hex) > length) {
    char *newHex = calloc(length + 1, sizeof(char));
    strncpy(newHex, hex + (strlen(hex) - length), length);
    hex = newHex;
  }

  return hex;
}

int compareHex(char *hexA, char *hexB) {
  if (strlen(hexA) < strlen(hexB)) {
    hexA = setLengthOfHex(hexA, strlen(hexB));
  } else if (strlen(hexB) < strlen(hexA)) {
    hexB = setLengthOfHex(hexB, strlen(hexA));
  }

  for (int i = 0; i < strlen(hexA); i++) {
    if (hexToDec(hexA[i]) > hexToDec(hexB[i])) {
      return 1;
    } else if (hexToDec(hexA[i]) < hexToDec(hexB[i])) {
      return -1;
    }
  }

  return 0;
}

int main(int argc, char *argv[]) {
  char *fileName = calloc(28, sizeof(char));
  char *code = calloc(22, sizeof(char));

  if (argc >= 2) {
    strncpy(fileName, argv[1], strlen(argv[1]));
    strncpy(fileName + ((strlen(argv[1])) * sizeof(char)), ".txt", 4);
  }

  FILE *file;
  file = fopen(fileName, "r");
  while (file == NULL) {
    printf("Invalid User ID! Please enter User ID: ");
    memset(fileName, 0, 28);
    fgets(fileName, 23, stdin);
    strncpy(fileName + (((strlen(fileName)) - 1) * sizeof(char)), ".txt", 4);
    file = fopen(fileName, "r");
  }
  char *passwordA = calloc(21, sizeof(char));
  char *passwordB = calloc(21, sizeof(char));
  char *tempPasswordB = calloc(23, sizeof(char));
  char *passwordC = calloc(21, sizeof(char));
  char *tempPasswordC = calloc(23, sizeof(char));
  char *passwordCheck = calloc(21, sizeof(char));
  char *userEnteredPasswordCheck = calloc(22, sizeof(char));

  fgets(tempPasswordB, 22, file);
  fgets(tempPasswordC, 22, file);
  strncpy(passwordB, tempPasswordB, 20);
  strncpy(passwordC, tempPasswordC, 20);


  if (argc >= 3) {
    strncpy(code, argv[2], strlen(argv[2]));
  }

  while (strlen(code) < 20) {
    printf("Invalid Code Entry! Please enter code: ");
    memset(code, 0, 22);
    fgets(code, 21, stdin);
    code[20] = '\0';
  }

  if (compareHex(code, passwordB) < 0) {
    strncpy(passwordA, setLengthOfHex(subtractHex(addHex(code, passwordC), passwordB), 20), 20);
    printf("%s\n", setLengthOfHex(modHex(multiplyHex(subtractHex(addHex(code, passwordC), passwordB), passwordB), passwordC), 20));
  } else {
    strncpy(passwordA, setLengthOfHex(subtractHex(code, passwordB), 20), 20);
    printf("%s\n", setLengthOfHex(modHex(multiplyHex(subtractHex(code, passwordB), passwordB), passwordC), 20));
  }

  strncpy(passwordCheck, setLengthOfHex(modHex(multiplyHex(multiplyHex(multiplyHex(modHex(passwordA, passwordB), modHex(passwordB, passwordA)), modHex(passwordC, passwordA)), modHex(passwordC, passwordB)), "100000000000000000000"), 20), 20);

  int c;
  while ((c = getchar()) != '\n' && c != EOF);

  printf("Please enter verification: ");
  fgets(userEnteredPasswordCheck, 21, stdin);
  userEnteredPasswordCheck[20] = '\0';

  while (compareHex(passwordCheck, userEnteredPasswordCheck) != 0) {
    printf("Incorrect.  Please enter verification: ");
    memset(userEnteredPasswordCheck, 0, 22);
    fgets(userEnteredPasswordCheck, 21, stdin);
    userEnteredPasswordCheck[20] = '\0';
  }

  fclose(file);



  file = fopen(fileName, "w");


  strncpy(passwordB, setLengthOfHex(modHex(addHex(passwordB, multiplyHex(passwordC, passwordC)), "100000000000000000000"), 20), 20);
  strncpy(passwordC, setLengthOfHex(modHex(addHex(passwordC, multiplyHex(passwordA, passwordA)), "100000000000000000000"), 20), 20);
  while (compareHex(passwordB, passwordC) >= 0 || compareHex("1000000000000000", passwordC) >= 0) {
    strncpy(passwordB, setLengthOfHex(modHex(addHex(passwordB, multiplyHex(passwordC, passwordC)), "100000000000000000000"), 20), 20);
    strncpy(passwordC, setLengthOfHex(modHex(addHex(passwordC, multiplyHex(passwordA, passwordA)), "100000000000000000000"), 20), 20);
  }




  fprintf(file, passwordB);
  fprintf(file, "\n");
  fprintf(file, passwordC);
  fclose(file);

  return 0;
}
