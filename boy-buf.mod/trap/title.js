function title() {
    env.state = 'title'
    lab.screen.title.show()
    lab.screen.title.keep(env.style.titleTimeout)
}
