import { Router, Request, Response, NextFunction } from 'express';

/* interface RequestWithBody {
  body: { [key: string]: string | undefined }
} */

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if(req.session && req.session.loggedIn) {
    next();
    return;
  }

  res.status(403);
  res.send('Not Permitted')
}

const router = Router();



router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if(email && password && email === 'test@test.com' && password === '1234'){

    req.session = { loggedIn: true };
    res.redirect('/');
  }else {
    res.send('Your email or password is invalid');
  }
  
});

router.get('/', (req: Request, res: Response) => {
  if(req.session && req.session.loggedIn) {
    res.send(`
      <div>
        <h1>You are logged In</h1>
        <a href='/logout'>Logout</a>
      </div>
    `)
  }else {
    res.send(`
      <div>
        <h1>You are not logged In</h1>
        <a href='/login'>LogIn</a>
      </div>
    `)
  }
})

router.get('/logout', (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.send('Welcome to protected route, logged in user')
})

export { router }