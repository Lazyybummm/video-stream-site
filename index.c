%{
    #include<stdio.h>
    int ch=0,b1=0,ln=1,wr=0,ntab=0;
    [\n]{ln++;ch++;}
    [\t]{ntab++;ch++}
    [a-zA-Z0-9] + {wr++;ch=ch+yyleng;}
    [" "] {b1++;ch++;}
    {ch++;}

    int yywrap(){
        return 1;
    }

    int main(int argc,char *argv[])
    {

        extern FILE *yyin;
        yyin=fopen(argv[1],"r")
        yylex();
        printf("\nLINES:%d\nWORDS:%d\nCHARACTER: %d\nBLANK:%d\n TABS:%d\n",ln,wr,ch,b1,ntab)
    }
}