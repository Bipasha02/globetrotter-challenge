#include<iostream>
using namespace std;

int power(int x, int n, int d) {
    if(x==0) 
    return 0;
 
    long long res=1,m=x;
    while(n>0){  
        if(n&1) 
        res = (res*m)%d;    
        n = n>>1;         
        m = (m*m)%d;    
    }
    return (d + res)%d;
}

int main()
{
    int x,n,d;
    cout << "Enter the base (x): ";
    cin >> x;
    cout << "Enter the exponent (n): ";
    cin >> n;
    cout << "Enter the modulus (d): ";
    cin >> d;

    int result = power(x, n, d);
    cout << "Result: " << result << endl;

    return 0;
}